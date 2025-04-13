import async from "async";
import Logger from "../Logger.js";
import Debug from "debug";

const debug = Debug("DEBUG");

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
    let child_nodes;
    let node_type;

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

    if (this.raw_child_nodes.length === 0) {
      debug("BaseNode. No child nodes");
      this.content = this.node.childNodes().toString();
    } else {
    }
  }

  /**
   * Render tag as text. To be overridden where necessary.
   * @return {String}
   */
  toString() {
    debug("BaseNode.toString() of ", this.type);
    return this.evaluateChildren();
  }

  /**
   * Evaluate child nodes as text. For use in child class toString methods.
   * @return {String}
   */
  evaluateChildren() {
    debug(
      `BaseNode. evaluateChildren of ${this.type}. ${this.children.length} children.`,
    );

    // Hack to handle nodes that only have text in them
    if (this.content) {
      return this.content;
    }

    const result = this.children
      .map((child) => {
        const text = child.toString();
        debug("BaseNode. Child: ", child);
        debug("BaseNode. Child text: ", text);
        debug("BaseNode. Child name: ", child.type);

        return text;
      })
      .join("")
      .trim();
    debug(
      `BaseNode. evaluatingChildren result: "${result}", typeof: "${typeof result}"`,
    );
    return result;
  }

  getType() {
    return this.type;
  }
}
