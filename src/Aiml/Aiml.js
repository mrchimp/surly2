import fs from "fs";
import async from "async";
import libxmljs from "libxmljs";
import Category from "./Category.js";
import Debug from "debug";

const debug = Debug("surly2");

/**
 * Main AIML handler. Contains a list of category nodes, potentially loaded
 * from multiple files.
 */
export default class Aiml {
  constructor(options) {
    this.surly = options.surly;
    this.wipe();
    this.categories = [];
  }

  /**
   * Remove all loaded data from memory and set up defaults. Called when Aiml
   * object is initialised
   */
  wipe() {
    this.categories = [];
    this.topics = ["*"];
  }

  /**
   * Load an AIML string
   * @param {String} aiml    A whole AIML file
   */
  async parseAiml(aiml) {
    var xmlDoc = await libxmljs.parseXmlAsync(aiml);
    var topics = xmlDoc.find("topic"),
      categories,
      topic_name,
      topic_cats,
      i,
      j;

    // Handle topic cats first - they should be matched first
    for (i = 0; i < topics.length; i++) {
      topic_name = topics[i].getAttribute("name")?.value();
      topic_cats = topics[i].find("category");

      for (j = 0; j < topic_cats.length; j++) {
        this.categories.push(
          new Category(topic_cats[j], this.surly, topic_name),
        );
      }
    }

    categories = xmlDoc.find("category");
    debug("Parsing " + this.categories.length + " categories.");

    for (i = 0; i < categories.length; i++) {
      this.categories.push(new Category(categories[i], this.surly));
    }

    this.showCategories();
  }

  /**
   * List out all loaded categories and their topics. For debugging.
   */
  showCategories() {
    for (var i = 0; i < this.categories.length; i++) {
      debug(" - " + this.categories[i].pattern.text_pattern);
    }
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
  getResponse(sentence) {
    debug("getResponse", sentence);
    const category = this.findMatchingCategory(sentence);

    if (category) {
      const template = category.getTemplate();
      debug("Got template: ", typeof template);
      const templateText = template.toString();
      debug("templateText: ", typeof templateText);
      return templateText;
    } else {
      return "Wat.";
    }
  }

  /**
   * Loop through loaded AIML and return the `template` from the first `category`
   * with a `pattern` that matches `sentence`.
   * @param {String} sentence    Text input from user
   */
  findMatchingCategory(sentence) {
    debug("findMatchingCategory", typeof sentence);
    if (!this.hasData()) {
      throw "No data loaded.";
    }

    if (!sentence) {
      throw new Error("no sentence");
    }

    sentence = this.normaliseSentence(sentence);

    debug("normalised sentence: " + sentence);

    const matchingCategory = this.categories.find((item) =>
      item.match(sentence),
    );

    debug("matchingCategory", typeof matchingCategory);

    return matchingCategory;

    // @todo do something if no match maybe?
  }

  /**
   * Find files in a dir and run loadAimlFile on them
   * @param  {String} dir
   * @return {Undefined}
   */
  loadDir(dir) {
    var files = fs.readdirSync(dir);

    debug("Loading dir" + dir);

    for (var i in files) {
      if (!files.hasOwnProperty(i)) continue;

      var name = dir + "/" + files[i];

      if (fs.statSync(name).isDirectory()) {
        debug("Ignoring directory: " + name);
      } else if (name.substr(-5).toLowerCase() === ".aiml") {
        this.loadFile(name);
      }
    }
  }

  /**
   * Load an AIML file
   * @param  {String} file
   * @return {void}
   */
  loadFile(file) {
    debug("Loading file: " + file);
    fs.readFile(
      file,
      "utf8",
      function (err, xml) {
        if (err) {
          throw "Failed to load AIML file. " + err;
        }

        this.parseAiml(xml);
      }.bind(this),
    );
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
    debug("normalising ", sentence);

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
