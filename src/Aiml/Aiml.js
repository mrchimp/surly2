import fs from "fs";
import libxmljs from "libxmljs";
import Category from "./Category.js";
import Debug from "debug";
import { parseCategories, parseNodes } from "./Parser.js";

const debug = Debug("DEBUG");
const verbose = Debug("VERBOSE");

/**
 * Main AIML handler. Contains a list of category nodes, potentially loaded
 * from multiple files.
 * @property {Surly} surly
 * @property {Category[]} categories
 */
export default class Aiml {
  constructor(options) {
    this.surly = options.surly;
    this.categories = [];
    this.topicCategories = [];
    this.wipe();
  }

  /**
   * Remove all loaded data from memory and set up defaults. Called when Aiml
   * object is initialised
   */
  wipe() {
    this.categories = [];
    this.topicCategories = [];
    this.topics = ["*"];
  }

  /**
   * Load an AIML string
   * @param {String} aiml    A whole AIML file
   */
  async parseAiml(aiml) {
    debug("Aiml. Parsing AIML...");
    const xmlDoc = await libxmljs.parseXmlAsync(aiml);
    debug("Aiml. got xmlDoc");

    const topics = xmlDoc.find("topic");
    debug(`Aiml. Found ${topics.length} topic categories`);

    const categories = xmlDoc.find("category");
    debug(`Aiml - found ${categories.length} categories`);

    // Handle topic cats first - they should be matched first
    topics.forEach((topic) => {
      const topicName = topic.getAttribute("name")?.value();

      this.topicCategories.push(
        ...parseCategories(this.surly, topicName, ...topic.find("category")),
      );
    });

    this.categories.push(
      ...parseCategories(this.surly, undefined, ...categories),
    );

    this.debugPrintCategories();
  }

  /**
   * List out all loaded categories and their topics. For debugging.
   */
  debugPrintCategories() {
    this.categories.forEach((cat) => {
      debug(" - " + cat.pattern.text_pattern);
    });
  }

  /**
   * Simple check to see if any data has been loaded
   * @return {Boolean} True if data has been loaded
   */
  hasData() {
    return this.categories.length > 0;
  }

  /**
   * Give a sentence and get a response
   * @param {String}
   * @return {String}
   */
  getResponse(sentence, inputContext) {
    debug("Aiml. getResponse", sentence);
    const category = this.findMatchingCategory(sentence);

    if (category) {
      const template = category.getTemplate();
      verbose("Aiml. Got Template: ", template, `(typeof: ${typeof template})`);
      const templateText = template.eval(inputContext);
      debug(
        "Aiml. templateText: ",
        templateText,
        `(typeof: ${typeof templateText})`,
      );
      return templateText;
    } else {
      return "Wat.";
    }
  }

  /**
   * Loop through loaded AIML and return the `template` from the first `category`
   * with a `pattern` that matches `sentence`.
   * @param {String} sentence    Text input from user
   * @return Category
   */
  findMatchingCategory(sentence) {
    if (!this.hasData()) {
      throw "No data loaded.";
    }

    if (!sentence) {
      throw new Error("no sentence");
    }

    sentence = this.normaliseSentence(sentence);

    debug("Aiml. findMatchingCategory for sentence: ", sentence);

    let matchingCategory = this.topicCategories.find((category) => {
      debug(
        `Aiml. Testing category match... "${category.eval()}" against "${sentence}"`,
      );
      verbose("Aiml. category: ", category);
      return category.match(sentence);
    });

    if (!matchingCategory) {
      matchingCategory = this.categories.find((category) => {
        debug(
          `Aiml. Testing category match... "${category.eval()}" against "${sentence}"`,
        );
        verbose("Aiml. category: ", category);
        return category.match(sentence);
      });
    }

    debug("Aiml. matchingCategory", typeof matchingCategory);

    return matchingCategory;
  }

  /**
   * Find files in a dir and run loadAimlFile on them
   * @param  {String} dir
   * @return {Void}
   */
  async loadDir(dir) {
    const files = fs.readdirSync(dir);

    debug("Aiml. Loading dir: " + dir);

    for (let i in files) {
      if (!files.hasOwnProperty(i)) continue;

      const name = dir + "/" + files[i];

      if (fs.statSync(name).isDirectory()) {
        // @todo make recursive
        debug("Aiml. Ignoring directory: " + name);
      } else if (name.slice(-5).toLowerCase() !== ".aiml") {
        debug("Aiml. Ignoring file: ", name);
      } else {
        await this.loadFile(name);
      }
    }
  }

  /**
   * Load an AIML file
   * @param  {String} file
   * @return {Promise}
   */
  async loadFile(file) {
    debug("Aiml. Loading file: " + file);

    let xml;

    try {
      xml = fs.readFileSync(file, "utf8");
    } catch (err) {
      if (err) {
        debug("Aiml. Failed loading AIML file. ", err);
        return;
      }
    }

    return this.parseAiml(xml);
  }

  /**
   * Perform input normalisation. See AIML spec section 8.3
   * Should (but doesn't yet) include:
   *  - Substitution normalisations
   *  - Sentence-splitting normalisations
   *  - Pattern-fitting normalisations
   * @todo - check against spec
   *
   * @param  {String} sentence [description]
   * @return {String}          [description]
   */
  normaliseSentence(sentence) {
    if (!sentence) {
      return sentence; // @todo throw an error or something
    }

    // add spaces to prevent false positives
    if (sentence.charAt(0) !== " ") {
      sentence = " " + sentence;
    }

    // Remove trailing punctuation - @todo use regex!
    while (
      ["!", ".", "?"].indexOf(sentence.charAt(sentence.length - 1)) !== -1
    ) {
      sentence = sentence.substring(0, sentence.length - 1);
    }

    if (sentence.charAt(sentence.length - 1) !== " ") {
      sentence = sentence + " ";
    }

    sentence = sentence.toUpperCase(); // @todo - remove this

    return sentence;
  }
}
