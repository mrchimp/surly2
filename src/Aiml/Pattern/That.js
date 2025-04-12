import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-pattern-side-that
 *
 * The pattern-side that element is a special type of pattern element used for
 *context matching. The pattern-side that is optional in a category, but if it
 *occurs it must occur no more than once, and must immediately follow the
 *pattern and immediately precede the template. A pattern-side that element
 *contains a simple pattern expression.
 *
 * The contents of the pattern-side that are appended to the full match path
 * that is constructed by the AIML interpreter at load time, as described
 * in [8.2].
 *
 * If a category does not contain a pattern-side that, the AIML interpreter must
 * assume an "implied" pattern-side that containing the pattern expression *
 * (single asterisk wildcard).
 *
 * A pattern-side that element has no attributes.
 *
 * <!-- Category: aiml-category-elements -->
 * <aiml:that>
 *    <!-- Content: aiml-pattern-expression -->
 * </aiml:that>
 */
export default class PatternThat extends BaseNode {
  constructor(node, surly, category) {
    super(node, surly);
    this.category = category;
    this.type = "patternThat";
  }
}
