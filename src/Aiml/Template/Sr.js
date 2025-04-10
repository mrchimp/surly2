import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-short-cut-elements
 *
 *  The sr element is a shortcut for:
 *      <srai><star/></srai>
 *
 * The atomic sr does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:sr/>
 */
export default class Sr extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "sr";
    this.surly = surly;
  }

  getText() {
    const star = this.surly.environment.wildcard_stack.getLast();
    return this.surly.talk(star[0]);
  }
}
