import async from 'async';
import Logger from '../Logger.js';
import Bot from './Template/Bot.js';
import Condition from './Template/Condition.js';
import DateNode from './Template/DateNode.js';
import Formal from './Template/Formal.js';
import Gender from './Template/Gender.js';
import Get from './Template/Get.js';
import That from './Template/That.js';
import Think from './Template/Think.js';
import Input from './Template/Input.js';
import Inventory from './Template/Inventory.js';
import Li from './Template/Li.js';
import Lowercase from './Template/Lowercase.js';
import Person from './Template/Person.js';
import Person2 from './Template/Person2.js';
import Random from './Template/Random.js';
import Sentence from './Template/Sentence.js';
import SetNode from './Template/Set.js';
import Size from './Template/Size.js';
import Sr from './Template/Sr.js';
import Srai from './Template/Srai.js';
import Star from './Template/Star.js';
import TextNode from './Template/Text.js';
import Uppercase from './Template/Uppercase.js';
import Version from './Template/Version.js';


/**
 * Base node class for nodes that can have children
 */
export default class BaseNode {

  /**
   * Constructor method
   * @param  {Node} node Xmllibjs node object
   */
  constructor (node, surly) {
    var child_nodes,
      node_type;

    this.log = new Logger();
    this.type = 'basenode';
    this.children = [];
    this.surly = surly;

    // Allow empty nodes for manually creating elements
    if (node === null) {
      return;
    }

    if (typeof node.childNodes !== 'function') {
      return false;
    }

    child_nodes = node.childNodes();

    for (var i = 0; i < child_nodes.length; i++) {
      node_type = child_nodes[i].name().toLowerCase();

      // @todo - replace this wi something nicer
      switch (node_type) {
        case 'a': // Treat A tags as plain text. @todo
        case 'text':
          this.children.push(new TextNode(child_nodes[i], this.surly));
          break;
        case 'br':
          this.children.push(new TextNode('\n', this.surly));
          break;
        case 'bot':
          this.children.push(new Bot(child_nodes[i], this.surly));
          break;
        case 'condition':
          this.children.push(new Condition(child_nodes[i], this.surly));
          break;
        case 'date':
          this.children.push(new DateNode(child_nodes[i], this.surly));
          break;
        case 'gender':
          this.children.push(new Gender(child_nodes[i], this.surly));
          break;
        case 'get':
          this.children.push(new Get(child_nodes[i], this.surly));
          break;
        case 'input':
          this.children.push(new Input(child_nodes[i], this.surly));
          break;
        case 'inventory':
          this.children.push(new Inventory(child_nodes[i], this.surly));
          break;
        case 'li':
          this.children.push(new Li(child_nodes[i], this.surly));
          break;
        case 'lowercase':
          this.children.push(new Lowercase(child_nodes[i], this.surly));
          break;
        case 'person':
          this.children.push(new Person(child_nodes[i], this.surly));
          break;
        case 'person2':
          this.children.push(new Person2(child_nodes[i], this.surly));
          break;
        case 'random':
          this.children.push(new Random(child_nodes[i], this.surly));
          break;
        case 'set':
          this.children.push(new SetNode(child_nodes[i], this.surly));
          break;
        case 'size':
          this.children.push(new Size(child_nodes[i], this.surly));
          break;
        case 'sr':
          this.children.push(new Sr(child_nodes[i], this.surly));
          break;
        case 'srai':
          this.children.push(new Srai(child_nodes[i], this.surly));
          break;
        case 'star':
          this.children.push(new Star(child_nodes[i], this.surly));
          break;
        case 'uppercase':
          this.children.push(new Uppercase(child_nodes[i], this.surly));
          break;
        case 'formal':
          this.children.push(new Formal(child_nodes[i], this.surly));
          break;
        case 'sentence':
          this.children.push(new Sentence(child_nodes[i], this.surly));
          break;
        case 'that':
          this.children.push(new That(child_nodes[i], this.surly));
          break;
        case 'think':
          this.children.push(new Think(child_nodes[i], this.surly));
          break;
        case 'version':
          this.children.push(new Version(child_nodes[i], this.surly));
          break;
        default:
          this.children.push(new TextNode('[NOT IMPLEMENTED: ' + node_type + ']', this.surly));
      }
    }
  }

  /**
   * Render tag as text. To be overridden where necessary.
   * @return {String}
   */
  getText(callback) {
    this.evaluateChildren(callback);
  }

  /**
  * Evaluate child nodes as text. For use in child class getText methods.
  * @return {String}
  */
  evaluateChildren (respond) {
    async.concat(this.children, function (item, callback) {
      item.getText(callback);
    }, function (err, results) {
      if (typeof results !== 'string') {
        results = results.join('');
      }

      respond(err, results.trim());
    });
  }

  getType() {
    return this.type;
  }
};
