import async from "async";
import Logger from "../Logger.js";
import Debug from "debug";

const debug = Debug("surly2");

/**
 * Base node class for nodes that can have children
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

    // for (var i = 0; i < child_nodes.length; i++) {
    //   node_type = child_nodes[i].name().toLowerCase();

    //   // @todo - replace this wi something nicer
    //   switch (node_type) {
    //     case 'a': // Treat A tags as plain text. @todo
    //     case 'text':
    //       this.children.push(new TextNode(child_nodes[i], this.surly));
    //       break;
    //     case 'br':
    //       this.children.push(new TextNode('\n', this.surly));
    //       break;
    //     case 'bot':
    //       this.children.push(new Bot(child_nodes[i], this.surly));
    //       break;
    //     case 'condition':
    //       this.children.push(new Condition(child_nodes[i], this.surly));
    //       break;
    //     case 'date':
    //       this.children.push(new DateNode(child_nodes[i], this.surly));
    //       break;
    //     case 'gender':
    //       this.children.push(new Gender(child_nodes[i], this.surly));
    //       break;
    //     case 'get':
    //       this.children.push(new Get(child_nodes[i], this.surly));
    //       break;
    //     case 'input':
    //       this.children.push(new Input(child_nodes[i], this.surly));
    //       break;
    //     case 'inventory':
    //       this.children.push(new Inventory(child_nodes[i], this.surly));
    //       break;
    //     case 'li':
    //       this.children.push(new Li(child_nodes[i], this.surly));
    //       break;
    //     case 'lowercase':
    //       this.children.push(new Lowercase(child_nodes[i], this.surly));
    //       break;
    //     case 'person':
    //       this.children.push(new Person(child_nodes[i], this.surly));
    //       break;
    //     case 'person2':
    //       this.children.push(new Person2(child_nodes[i], this.surly));
    //       break;
    //     case 'random':
    //       this.children.push(new Random(child_nodes[i], this.surly));
    //       break;
    //     case 'set':
    //       this.children.push(new SetNode(child_nodes[i], this.surly));
    //       break;
    //     case 'size':
    //       this.children.push(new Size(child_nodes[i], this.surly));
    //       break;
    //     case 'sr':
    //       this.children.push(new Sr(child_nodes[i], this.surly));
    //       break;
    //     case 'srai':
    //       this.children.push(new Srai(child_nodes[i], this.surly));
    //       break;
    //     case 'star':
    //       this.children.push(new Star(child_nodes[i], this.surly));
    //       break;
    //     case 'uppercase':
    //       this.children.push(new Uppercase(child_nodes[i], this.surly));
    //       break;
    //     case 'formal':
    //       this.children.push(new Formal(child_nodes[i], this.surly));
    //       break;
    //     case 'sentence':
    //       this.children.push(new Sentence(child_nodes[i], this.surly));
    //       break;
    //     case 'that':
    //       this.children.push(new That(child_nodes[i], this.surly));
    //       break;
    //     case 'think':
    //       this.children.push(new Think(child_nodes[i], this.surly));
    //       break;
    //     case 'version':
    //       this.children.push(new Version(child_nodes[i], this.surly));
    //       break;
    //     default:
    //       this.children.push(new TextNode('[NOT IMPLEMENTED: ' + node_type + ']', this.surly));
    //   }
    // }
  }

  /**
   * Render tag as text. To be overridden where necessary.
   * @return {String}
   */
  getText() {
    this.evaluateChildren();
  }

  /**
   * Evaluate child nodes as text. For use in child class getText methods.
   * @return {String}
   */
  evaluateChildren() {
    return this.children
      .map((child) => {
        const text = child.getText();
        debug("Child text", text);
        return text;
      })
      .join("")
      .trim();

    // async.concat(this.children, function (item, callback) {
    //   item.getText(callback);
    // }, function (err, results) {
    //   if (typeof results !== 'string') {
    //     results = results.join('');
    //   }

    //   respond(err, results.trim());
    // });
  }

  getType() {
    return this.type;
  }
}
