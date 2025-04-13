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
      debug(`BaseNode (${this.type}) - No child nodes`);
      this.content = node.childNodes().toString();
    }
  }

  /**
   * Render tag as text. To be overridden where necessary.
   * @return {String}
   */
  toString() {
    debug(`BaseNode (${this.type}) - toString()`);
    return this.evaluateChildren();
  }

  /**
   * Evaluate child nodes as text. For use in child class toString methods.
   * @return {String}
   */
  evaluateChildren() {
    debug(
      `BaseNode (${this.type}) - evaluateChildren. ${this.children.length} children.`,
    );

    const result = this.children
      .map((child) => {
        const text = child.toString();
        debug(`BaseNode (${this.type}) - Child: ${child}`);
        debug(`BaseNode (${this.type}) - Child text: ${text}`);
        debug(`BaseNode (${this.type}) - Child name: ${child.type}`);

        return text;
      })
      .join("")
      .trim();
    debug(
      `BaseNode (${this.type}) - evaluatingChildren result: "${result}", typeof: "${typeof result}"`,
    );
    return result;
  }

  getType() {
    return this.type;
  }
}
