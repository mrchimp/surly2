/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-pattern
 *
 * A pattern is an element whose content is a mixed pattern expression. Exactly
 * one pattern must appear in each category. The pattern must always be the
 * first child element of the category. A pattern does not have any attributes.
 *
 * The contents of the pattern are appended to the full match path that is
 * constructed by the AIML interpreter at load time, as described in [8.2].
 *
 * <!-- Category: aiml-category-elements -->
 *
 * <aiml:pattern>
 *    <!-- Content: aiml-pattern-expression -->
 * </aiml:pattern>
 */

import Debug from "debug";

const debug = Debug("DEBUG");
const verbose = Debug("VERBOSE");

export default class Pattern {
  constructor(pattern, surly) {
    debug("Pattern. Constructing.", pattern.text());
    this.surly = surly;
    this.wildcard_regex = " ([A-Z|0-9|\\s]*[A-Z|0-9|-]*[A-Z|0-9]*[!|.|?|\\s]*)";
    this.text_pattern = pattern.text();
    this.regex = this.patternToRegex(this.text_pattern);
  }

  toString() {
    return `${this.text_pattern}`;
  }

  /**
   * Match the pattern against a given sentence
   * @param  {String} sentence Input from user
   * @return {Boolean}         True if sentence and pattern match
   */
  matchSentence(sentence) {
    // Add spaces to prevent false positives
    if (sentence.charAt(0) !== " ") {
      sentence = " " + sentence;
    }

    if (sentence.charAt(sentence.length - 1) !== " ") {
      sentence = sentence + " ";
    }

    sentence = sentence.toUpperCase();

    // var regex_pattern = this.aimlPatternToRegex(pattern);
    const matches = sentence.match(this.regex);

    if (
      matches &&
      (matches[0].length >= sentence.length ||
        this.regex.indexOf(this.wildcard_regex) > -1)
    ) {
      this.surly.environment.wildcard_stack.push(
        this.getWildCardValues(sentence, this),
      );
      return true;
    }

    return false;
  }

  /**
   * Convert a string with wildcards (*s) to regex
   * @param  String pattern The string with wildcards
   * @return String      The altered string
   */
  patternToRegex(pattern) {
    let lastChar;
    const firstChar = pattern.charAt(0);

    // add spaces to prevent e.g. foo matching food
    if (firstChar != "*") {
      pattern = " " + pattern;
    }

    const lastCharIsStar = pattern.charAt(pattern.length - 1) === "*";

    // remove spaces before *s
    pattern = pattern.replace(" *", "*");

    // replace wildcards with regex
    pattern = pattern.replace(/\*/g, this.wildcard_regex);

    if (!lastCharIsStar) {
      pattern = pattern + "[\\s|?|!|.]*";
    }

    return new RegExp(pattern, "g");
  }

  /**
   * Compare the pattern to given sentence
   * @param  {String}  sentence
   * @return {Boolean}          True if sentence and pattern match
   */
  compare(sentence) {
    verbose("Pattern. compare() ", sentence);
    const matches = sentence.match(this.regex);

    if (
      matches &&
      (matches[0].length >= sentence.length ||
        this.text_pattern.indexOf(this.wildcard_regex) > -1)
    ) {
      this.surly.environment.wildcard_stack.push(
        this.getWildCardValues(sentence),
      );
      return true;
    }

    return false;
  }

  getWildCardValues(sentence) {
    const replace_array = this.text_pattern.split("*");

    if (replace_array.length < 2) {
      return this.surly.environment.wildcard_stack.getLast();
    }

    for (let i = 0; i < replace_array.length; i++) {
      sentence = sentence.replace(replace_array[i], "|");
    }

    // split by pipe and we're left with values and empty strings
    sentence = sentence.trim().split("|");

    const output = [];
    let chunk = "";

    for (i = 0; i < sentence.length; i++) {
      chunk = sentence[i].trim();

      if (chunk === "") continue;

      if (chunk.charAt(chunk.length - 1) === "?") {
        chunk = chunk.substr(0, chunk.length - 1);
      }

      output.push(chunk);
    }

    return output;
  }
}
