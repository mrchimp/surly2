import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-random
 *
 * The random element instructs the AIML interpreter to return exactly one of
 * its contained li elements randomly. The random element must contain one or
 * more li elements of type defaultListItem, and cannot contain any other
 * elements.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:random>
 *    <!-- Contents: default-list-item+ -->
 * </aiml:random>
 */
export default class Random extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "random";
  }

  eval() {
    const elem =
      this.children[Math.floor(Math.random() * this.children.length)];

    return elem.eval();
  }
}
