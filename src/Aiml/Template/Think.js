import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-think
 *
 * The think element instructs the AIML interpreter to perform all usual
 * processing of its contents, but to not return any value, regardless of
 * whether the contents produce output.
 *
 * The think element has no attributes. It may contain any AIML
 * template elements.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:think>
 *    <!-- Contents: aiml-template-elements -->
 * </aiml:think>
 */
export default class Think extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "think";
  }

  eval() {
    super.evaluateChildren();
    return "";
  }
}
