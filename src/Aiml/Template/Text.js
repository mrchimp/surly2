import BaseNode from "../BaseNode.js";

/**
 * Plain text node. This is build to function the same as a BaseNode but it
 * doesn't inherit because the constructor needs to be different and I don't
 * know it's late leave me alone.
 *
 * This is not part of the AIML Spec, it just represents the plain text
 * within other elements.
 */
export default class Text extends BaseNode {
  /**
   * Constructor method
   * @param  {Node} node Xmllibjs node object
   */
  constructor(node, surly) {
    super(node, surly);
    this.type = "text";

    if (typeof node === "string") {
      this.content = node;
    } else {
      this.content = node.toString();
    }
  }

  getType() {
    return this.type;
  }

  /**
   * Return the node and any children as text
   * @return {String}
   */
  eval() {
    return this.content;
  }
}
