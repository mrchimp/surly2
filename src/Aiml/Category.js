import Template from "./Template.js";
import Pattern from "./Pattern.js";
import PatternThat from "./Pattern/That.js";
import Debug from "debug";
import { parseChildren } from "./Parser.js";

const debug = Debug("DEBUG");

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
    this.that = null;

    const patterns = category.find("pattern");
    const templates = category.find("template");
    const thats = category.find("that");

    if (patterns.length !== 1) {
      throw "Category should have exactly one PATTERN.";
    }

    if (templates.length !== 1) {
      throw "Category should have exactly one TEMPLATE.";
    }

    this.pattern = new Pattern(patterns[0], surly);

    this.template = new Template(templates[0], surly);
    this.template.children.push(...parseChildren(this.template, false));
    this.template.category = this;
    this.template.raw_child_nodes = [];

    if (thats.length > 1) {
      throw "Category must not contain more than one THAT.";
    }

    if (thats.length === 1) {
      this.that = new PatternThat(thats[0], surly, this);
      this.that.children.push(...parseChildren(this.that, true));
      this.that.category = this;
      this.that.raw_child_nodes = [];
    }
  }

  /**
   * Return the child pattern element
   * @return {Pattern}
   */
  getPattern() {
    return this.pattern;
  }

  toString() {
    return this.getPattern().toString();
  }

  /**
   * Check whether the category has a <that> and whether
   * if matches the previous response
   * @return {Boolean}          True if <that> exists and matches
   */
  checkThat() {
    // If no THAT then it matches by default
    if (!this.that) {
      debug("Category. No THAT.");
      return true;
    }

    const thatText = this.that.toString();

    const previous = this.surly.environment
      .getPreviousResponse(1)
      .toUpperCase();
    debug('Category. Comparing THAT - "' + thatText + '", "' + previous + '"');
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
   * @param {String}
   * @return {Boolean}
   */
  match(sentence) {
    if (this.pattern.compare(sentence)) {
      debug("Category. Matched pattern: " + sentence + " -- " + this.pattern);

      if (
        this.topic !== "*" &&
        this.topic.toUpperCase() !== this.surly.environment.getVariable("topic")
      ) {
        return false;
      }

      const thatMatch = this.checkThat();

      debug("Category. That match?", thatMatch);
      return thatMatch;
    } else {
      debug("Category. No match");
      return false;
    }
  }
}
