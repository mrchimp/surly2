import Template from "./Template.js";
import Pattern from "./Pattern.js";
import PatternThat from "./Pattern/That.js";
import Debug from "debug";
import { parseTemplate } from "./Parser.js";

const debug = Debug("surly2");

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-category
 *
 * A category is a top-level (or second-level, if contained within a topic)
 * element that contains exactly one pattern and exactly one template. A
 * category does not have any attributes.
 *
 * All category elements that do not occur as children of an explicit topic
 * element must be assumed by the AIML interpreter to occur as children of an
 * "implied" topic whose name attribute has the value * (single asterisk
 * wildcard).
 *
 * <!-- Category: top-level-element -->
 *
 * <aiml:category>
 *    <!-- Content: aiml-category-elements -->
 * </aiml:category>
 */
export default class Category {
  /**
   * Constructor method
   * @param  {Node} node Xmllibjs node object
   */
  constructor(category, surly, topic) {
    this.topic = topic || "*";
    this.surly = surly;
    var patterns = category.find("pattern");
    var templates = category.find("template");
    var thats = category.find("that");

    if (patterns.length !== 1) {
      throw "Category should have exactly one PATTERN.";
    }

    if (templates.length !== 1) {
      throw "Category should have exactly one TEMPLATE.";
    }

    this.pattern = new Pattern(patterns[0], surly);
    this.pattern.category = this;
    this.template = parseTemplate(templates[0], surly);
    // this.template = new Template(templates[0], surly);
    this.template.category = this;
    this.that = "";

    if (thats.length === 1) {
      this.that = new PatternThat(thats[0], surly, this);
      // this.that.category = this;
    } else if (thats.length > 1) {
      throw "Category must not contain more than one THAT.";
    }
  }

  /**
   * Return the child pattern element
   * @return {Pattern}
   */
  getPattern() {
    return this.pattern;
  }

  /**
   * Check whether the category has a <that> and whether
   * if matches the previous response
   * @param  {Object}  category Libxmljs category aiml node
   * @return {Boolean}          True if <that> exists and matches
   */
  checkThat() {
    // If no THAT then it matches by default
    if (!this.that) {
      debug("No THAT.");
      return true;
    }

    const thatText = this.that.getText();
    var previous = this.surly.environment.getPreviousResponse(1).toUpperCase();
    debug('Comparing THAT - "' + thatText + '", "' + previous + '"');
    return thatText === previous;
  }

  /**
   * Return the template node
   * @return {Template}
   */
  getTemplate() {
    return this.template;
  }

  /**
   * Check the category against a given sentence. Also, if a THAT tag is present
   * in the category, check that against the previous response
   */
  match(sentence) {
    debug("Comparing pattern: " + this.pattern + " with " + sentence);
    if (this.pattern.compare(sentence)) {
      debug("Matched pattern: " + sentence + " -- " + this.pattern);

      if (
        this.topic !== "*" &&
        this.topic.toUpperCase() !== this.surly.environment.getVariable("topic")
      ) {
        return false;
      }

      const thatMatch = this.checkThat();

      debug("That match?", thatMatch);
      return thatMatch;
    } else {
      debug("No match");
      return false;
    }
  }
}
