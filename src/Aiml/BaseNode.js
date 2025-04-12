import async from "async";
import Logger from "../Logger.js";
import Debug from "debug";

const debug = Debug("surly2");

/**
 * Base node class for nodes that can have children
 *
 * @property {BaseNode[]} children
 * @property {Surly} surly
 */
export default class BaseNode {
  /**
   * Constructor method
   * @param  {Node} node Xmllibjs node object
   */
  constructor(node, surly) {
    var child_nodes, node_type;

    this.log = new Logger();
    this.type = "basenode";
    this.children = [];
    this.surly = surly;

    // Allow empty nodes for manually creating elements
    if (node === null) {
      return;
    }

    if (typeof node.childNodes !== "function") {
      return false;
    }

    this.raw_child_nodes = node.childNodes();
  }

  /**
   * Render tag as text. To be overridden where necessary.
   * @return {String}
   */
  toString() {
    this.evaluateChildren();
  }

  /**
   * Evaluate child nodes as text. For use in child class toString methods.
   * @return {String}
   */
  evaluateChildren() {
    const result = this.children
      .map((child) => {
        const text = child.toString();
        debug("BaseNode evaluateChildren child text: ", text);
        debug("Child text", text);
        return text;
      })
      .join("")
      .trim();
    debug("Evaluating Children", this.type, this.children.length, "result: ", result, typeof result);
    return result;
  }

  getType() {
    return this.type;
  }
}
