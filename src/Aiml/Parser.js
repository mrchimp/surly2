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
import Category from "./Category.js";
import Pattern from "./Pattern.js";

const debug = Debug("DEBUG");

export function parseCategories(surly, topic, ...categories) {
  debug(`parseNodes - parsing ${categories.length} nodes`);
  return categories.map((node) => parseCategory(surly, node, topic));
}

export function parseCategory(surly, rawCategory, topic) {
  const category = new Category(rawCategory, surly, topic);

  const patterns = rawCategory.find("pattern");
  const templates = rawCategory.find("template");
  const thats = rawCategory.find("that");

  if (patterns.length !== 1) {
    throw "Category should have exactly one PATTERN.";
  }

  if (templates.length !== 1) {
    throw "Category should have exactly one TEMPLATE.";
  }

  if (thats.length > 1) {
    throw "Category must not contain more than one THAT.";
  }

  category.pattern = parseNode(surly, patterns[0]);
  category.template = parseNode(surly, templates[0]);
  if (thats.length === 1) {
    category.that = parsePatternThat(surly, thats[0], category);
  }

  return category;
}

export function parsePatternThat(surly, rawThat, category) {
  const pattern = new PatternThat(rawThat, surly);
  pattern.children = parseNodes(surly, ...rawThat.childNodes());
  pattern.category = category;
  return pattern;
}

export function parseNodes(surly, ...nodes) {
  debug(`parseNodes - parsing ${nodes.length} nodes`);
  return nodes.map((node) => parseNode(surly, node));
}

export function parseNode(surly, rawNode) {
  const nodeType = rawNode.name().toLowerCase();

  debug(`parseNode - parsing ${nodeType} node`);

  const nodeTypes = {
    category: Category,
    template: Template,
    pattern: Pattern,

    // Treat A tags as plain text. @todo
    a: TextNode,
    text: TextNode,
    br: TextNode,
    bot: Bot,
    condition: Condition,
    date: DateNode,
    gender: Gender,
    get: Get,
    input: Input,
    inventory: Inventory,
    li: Li,
    lowercase: Lowercase,
    person: Person,
    person2: Person2,
    random: Random,
    set: SetNode,
    size: Size,
    sr: Sr,
    srai: Srai,
    star: Star,
    uppercase: Uppercase,
    formal: Formal,
    sentence: Sentence,
    that: That,
    think: Think,
    version: Version,
  };

  let node;
  if (typeof nodeTypes[nodeType] !== "undefined") {
    node = new nodeTypes[nodeType](rawNode, surly);
  } else {
    throw new Error(`Not implemented: ${nodeType}`);
  }

  debug(
    `Parser.parseNode() - Checking children. Found ${rawNode.childNodes().length}`,
  );

  const children = parseNodes(surly, ...rawNode.childNodes());

  node.setChildren(children);

  return node;
}
