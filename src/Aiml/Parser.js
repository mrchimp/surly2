import Template from "./Template.js";
import Bot from "./Template/Bot.js";
import Condition from "./Template/Condition.js";
import DateNode from "./Template/DateNode.js";
import Formal from "./Template/Formal.js";
import Gender from "./Template/Gender.js";
import Get from "./Template/Get.js";
import That from "./Template/That.js";
import Think from "./Template/Think.js";
import Input from "./Template/Input.js";
import Inventory from "./Template/Inventory.js";
import Li from "./Template/Li.js";
import Lowercase from "./Template/Lowercase.js";
import Person from "./Template/Person.js";
import Person2 from "./Template/Person2.js";
import Random from "./Template/Random.js";
import Sentence from "./Template/Sentence.js";
import SetNode from "./Template/Set.js";
import Size from "./Template/Size.js";
import Sr from "./Template/Sr.js";
import Srai from "./Template/Srai.js";
import Star from "./Template/Star.js";
import TextNode from "./Template/Text.js";
import Uppercase from "./Template/Uppercase.js";
import Version from "./Template/Version.js";
import Debug from "debug";

const debug = Debug("surly2");

export function parseTemplate(rawTemplate, surly) {
  const template = new Template(rawTemplate, surly);

  if (template.raw_child_nodes && template.raw_child_nodes.length) {
    template.children = template.raw_child_nodes.map((child) =>
      parseChild(child, surly),
    );
    template.raw_child_nodes = [];
  }

  return template;
}

function parseChild(child, surly) {
  let node;

  const node_type = child.name().toLowerCase();

  debug("parseChild", node_type, typeof node_type);

  switch (node_type) {
    case "a": // Treat A tags as plain text. @todo
    case "text":
      node = new TextNode(child, surly);
    case "br":
      node = new TextNode("\n", surly);
    case "bot":
      node = new Bot(child, surly);
    case "condition":
      node = new Condition(child, surly);
    case "date":
      node = new DateNode(child, surly);
    case "gender":
      node = new Gender(child, surly);
    case "get":
      node = new Get(child, surly);
    case "input":
      node = new Input(child, surly);
    case "inventory":
      node = new Inventory(child, surly);
    case "li":
      node = new Li(child, surly);
    case "lowercase":
      node = new Lowercase(child, surly);
    case "person":
      node = new Person(child, surly);
    case "person2":
      node = new Person2(child, surly);
    case "random":
      node = new Random(child, surly);
    case "set":
      node = new SetNode(child, surly);
    case "size":
      node = new Size(child, surly);
    case "sr":
      node = new Sr(child, surly);
    case "srai":
      node = new Srai(child, surly);
    case "star":
      node = new Star(child, surly);
    case "uppercase":
      node = new Uppercase(child, surly);
    case "formal":
      node = new Formal(child, surly);
    case "sentence":
      node = new Sentence(child, surly);
    case "that":
      node = new That(child, surly);
    case "think":
      node = new Think(child, surly);
    case "version":
      node = new Version(child, surly);
    default:
      node = new TextNode("[NOT IMPLEMENTED: " + node_type + "]", surly);
  }

  if (node.raw_child_nodes && node.raw_child_nodes.length) {
    node.children = node.raw_child_nodes.map((c) => parseChild(c));
    node.raw_child_nodes = [];
  }

  return node;
}
