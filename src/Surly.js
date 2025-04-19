"use strict";

import Stack from "./stack.js";
import Aiml from "./Aiml/Aiml.js";
import Environment from "./Environment.js";
import Debug from "debug";

const debug = Debug("DEBUG");

export default class Surly {
  constructor(options) {
    this.input_stack = new Stack(10);
    this.environment = new Environment();
    this.aiml = new Aiml({
      surly: this,
    });
    this.aiml.loadDir(options.brain).then(() => {
      debug("Finished loading");
    });
    this.environment.aiml = this.aiml; // @todo this is getting circular. Hmmm.
  }

  /**
   * Say 'sentence' to Surly
   * @param  {String}   sentence
   * @param  {Object} inputContext
   * @return {String}
   */
  talk(sentence, inputContext) {
    this.start_time = new Date();

    debug("-----------------------------");
    debug("INPUT: " + sentence);
    this.input_stack.push(sentence);

    if (sentence.length === 0) {
      return "Input was empty string.";
    }

    if (sentence.substring(0, 1) === "/") {
      debug("Skipping command string."); // @todo - do stuff
      return "COMMANDS DO NOTHING YET.";
    }

    if (this.environment.countCategories() === 0) {
      return "No AIML files loaded.";
    }

    const result = this.aiml.getResponse(sentence, inputContext);
    debug("Surly - talk  result: ", result);
    return this.handleResult(sentence, result);
  }

  /**
   * Do any extra stuff that needs doing with the results
   * @param {String} sentence
   * @param {String} response
   * @return {String}
   */
  handleResult(sentence, response) {
    const end_time = new Date();

    debug("OUTPUT: " + response + " (" + (end_time - this.start_time) + "ms)");

    // @todo this!
    // if (response) {
    //   previousResponse = this.normaliseTemplate(template);
    // }
    //
    debug("handleResponse", sentence, response);

    const normal_previous = this.aiml.normaliseSentence(response).trim();
    this.environment.previous_responses.push(normal_previous);
    this.environment.previous_inputs.push(sentence);

    return response;
  }
}
