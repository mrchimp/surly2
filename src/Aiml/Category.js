import Template from "./Template.js";
import Pattern from "./Pattern.js";
import PatternThat from "./Pattern/That.js";
import Debug from "debug";

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
  constructor(category, surly, topic = "*") {
    this.topic = topic;
    this.surly = surly;
    this.that = null;
  }

  /**
   * Return the child pattern element
   * @return {Pattern}
   */
  getPattern() {
    return this.pattern;
  }

  eval(inputContext) {
    return this.getPattern().eval();
  }

  setChildren(children) {
    this.chidlren = children;
  }

  /**
   * Check whether the category has a <that> and whether
   * if matches the previous response
   * @todo should be doing this logic on the THAT probably
   * @return {Boolean}          True if <that> exists and matches
   */
  checkThat() {
    // If no THAT then it matches by default
    if (!this.that) {
      debug("Category.checkThat() - No THAT, so it's a match.");
      return true;
    }

    const thatText = this.that.eval();

    if (!thatText) {
      debug("Category.checkThat() - thatText is empty, so it's a match");
      return true;
    }

    const previous = this.surly.environment
      .getPreviousResponse(1)
      .toUpperCase();

    debug(
      `Category.checkThat() - Comparing THAT "${thatText}" with previous input "${previous}"`,
    );
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
      debug("Category - Matched pattern: " + sentence + " -- " + this.pattern);

      const currentTopic = this.surly.environment.getVariable("topic");

      debug(
        `Category - Comparing topic "${this.topic.toUpperCase()}" with current topic "`,
      );

      if (this.topic !== "*" && this.topic.toUpperCase() !== currentTopic) {
        debug("Topic doesn't match.");
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
