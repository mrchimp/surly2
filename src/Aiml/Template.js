import BaseNode from "./BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-template
 *
 * A template is an element that appears within category elements. The template
 * must follow the pattern-side that element, if it exists; otherwise, it
 * follows the pattern element. A template does not have any attributes.
 *
 * <!-- Category: aiml-category-elements -->
 * <aiml:template>
 *    <!-- Content: aiml-template-elements -->
 * </aiml:template>
 *
 * The majority of AIML content is within the template. The template may contain
 * zero or more AIML template elements mixed with character data. The elements
 * described below are grouped for convenience.
 */
export default class Template extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "template";
  }
}
