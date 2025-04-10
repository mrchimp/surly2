"use strict";

import Stack from "./stack.js";
import Aiml from "./Aiml/Aiml.js";
import Environment from "./Environment.js";
import Debug from "debug";

const debug = Debug("surly2");

export default class Surly {
  constructor(options) {
    this.brain = [];
    this.input_stack = new Stack(10);
    this.callbacks = {};
    this.callbacks.respond = options.respond;
    this.environment = new Environment();
    this.aiml = new Aiml({
      surly: this,
    });
    this.aiml.loadDir(options.brain);
    this.environment.aiml = this.aiml; // @todo this is getting circular. Hmmm.
  }

  /**
   * Say 'sentence' to Surly
   * @param  {String}   sentence
   * @param  {Function} callback
   * @return {String}
   */
  talk(sentence, callback, user_id) {
    var i,
      start_time = new Date(),
      response;

    debug("-----------------------------");
    debug("INPUT: " + sentence);
    this.input_stack.push(sentence);

    if (sentence.length === 0) {
      callback("Input was empty string.", "Speak up!");
      return;
    }

    if (sentence.substr(0, 1) === "/") {
      debug("Skipping command string."); // @todo - do stuff
      this.respond("COMMANDS DO NOTHING YET.");
      return;
    }

    if (this.environment.countCategories() === 0) {
      callback("No AIML files loaded.", "My mind is blank.");
      return;
    }

    const result = this.aiml.getResponse(sentence);
    this.handleResult(sentence, result);
  }

  /**
   * Do any extra stuff that needs doing with the results
   */
  handleResult(sentence, response) {
    // process.exit();
    // var end_time = new Date();
    //
    // this.log('OUTPUT: ' + response + ' (' + (end_time - start_time) + 'ms)');
    // this.respond(response);

    // @todo this!
    // if (response) {
    //   previousResponse = this.normaliseTemplate(template);
    // }
    //
    debug("handleResponse", sentence, response);

    var normal_previous = this.aiml.normaliseSentence(response).trim();
    this.environment.previous_responses.push(normal_previous);
    this.environment.previous_inputs.push(sentence);
  }
}
