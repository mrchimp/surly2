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
import PatternThat from "./Pattern/That.js";

const debug = Debug("DEBUG");

export function parseChildren(node) {
  let children = [];

  if (node.raw_child_nodes && node.raw_child_nodes.length) {
    children = node.raw_child_nodes.map((child) => {
      return parseChild(child, node.surly);
    });
  }

  return children;
}

function parseChild(child, surly) {
  let node;
  let children = [];

  const node_type = child.name().toLowerCase();

  debug(
    "parseChild",
    `"${node_type}"`,
    typeof node_type,
    typeof child === "string" ? child : child.toString(),
  );

  switch (node_type) {
    case "a": // Treat A tags as plain text. @todo
    case "text":
      node = new TextNode(child, surly);
      break;
    case "br":
      node = new TextNode("\n", surly);
      break;
    case "bot":
      node = new Bot(child, surly);
      break;
    case "condition":
      node = new Condition(child, surly);
      break;
    case "date":
      node = new DateNode(child, surly);
      break;
    case "gender":
      node = new Gender(child, surly);
      break;
    case "get":
      node = new Get(child, surly);
      break;
    case "input":
      node = new Input(child, surly);
      break;
    case "inventory":
      node = new Inventory(child, surly);
      break;
    case "li":
      node = new Li(child, surly);
      break;
    case "lowercase":
      node = new Lowercase(child, surly);
      break;
    case "person":
      node = new Person(child, surly);
      break;
    case "person2":
      node = new Person2(child, surly);
      break;
    case "random":
      node = new Random(child, surly);
      break;
    case "set":
      node = new SetNode(child, surly);
      break;
    case "size":
      node = new Size(child, surly);
      break;
    case "sr":
      node = new Sr(child, surly);
      break;
    case "srai":
      node = new Srai(child, surly);
      break;
    case "star":
      node = new Star(child, surly);
      break;
    case "uppercase":
      node = new Uppercase(child, surly);
      break;
    case "formal":
      node = new Formal(child, surly);
      break;
    case "sentence":
      node = new Sentence(child, surly);
      break;
    case "that":
      node = new That(child, surly);
      break;
    case "think":
      node = new Think(child, surly);
      break;
    case "version":
      node = new Version(child, surly);
      break;
    default:
      node = new TextNode("[NOT IMPLEMENTED: " + node_type + "]", surly);
      break;
  }

  node.children.push(...parseChildren(node));
  node.raw_child_nodes = [];

  return node;
}
