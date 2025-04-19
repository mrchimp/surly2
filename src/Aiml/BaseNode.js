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
  }

  setChildren(children) {
    this.children = children;
  }

  /**
   * Render tag as text. To be overridden where necessary.
   * @return {String}
   */
  eval(inputContext) {
    debug(`BaseNode (${this.type}) - eval()`);
    return this.evaluateChildren(inputContext);
  }

  toString() {
    return `[Node of Type "${this.type}"]`;
  }

  /**
   * Evaluate child nodes as text. For use in child class toString methods.
   * @return {String}
   */
  evaluateChildren(inputContext) {
    debug(
      `BaseNode (${this.type}) - evaluateChildren. ${this.children.length} children.`,
    );

    const result = this.children
      .map((child) => {
        const text = child.eval();
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
