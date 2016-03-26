"use strict";

const fs = require('fs');
const Stack = require('./stack');
const Aiml = require('./Aiml/Aiml');
const Environment = require('./Environment');
const Logger = require('./Logger');

module.exports = class Surly {
  constructor (options) {
    this.log = new Logger();
    this.brain = [];
    this.input_stack = new Stack(10);
    this.callbacks = {};
    this.callbacks.respond = options.respond;
    this.environment = new Environment();
    this.aiml = new Aiml({
      surly: this
    });
    this.aiml.loadDir(options.brain);
    this.environment.aiml = this.aiml; // @todo this is getting circular. Hmmm.
    this.previous_response = '';
  }

  /**
  * Say 'sentence' to Surly
  * @param  {String}   sentence
  * @param  {Function} callback
  * @return {String}
  */
  talk (sentence, callback, user_id) {
    var i,
      start_time = new Date(),
      response;

    this.log.debug('INPUT: ' + sentence);
    this.input_stack.push(sentence);

    if (sentence.length === 0) {
      callback(null, 'Speak up!');
      return;
    }

    if (sentence.substr(0,1) === '/') {
      this.log.debug('Skipping command string.'); // @todo - do stuff
      this.respond('COMMANDS DO NOTHING YET.');
      return;
    }

    if (this.environment.countCategories() === 0) {
      callback(null, 'My mind is blank.');
      return;
    }

    this.aiml.getResponse(sentence, function (err, result) {
      this.handleResult(result);
      callback(err, result);
    }.bind(this));
  }

  /**
  * Do any extra stuff that needs doing with the results
  */
  handleResult (response) {
    // process.exit();
    // var end_time = new Date();
    //
    // this.log('OUTPUT: ' + response + ' (' + (end_time - start_time) + 'ms)');
    // this.respond(response);

    // @todo this!
    // if (response) {
    //   previousResponse = this.normaliseTemplate(template);
    // }

    var normal_previous = this.aiml.normaliseSentence(response).trim();
    this.environment.previous_response = normal_previous;
  }
};
