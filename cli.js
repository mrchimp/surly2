#!/usr/bin/env node

import pkg from './package.json' with { type: "json" };
import Surly from './src/Surly.js';
import Rc from "rc";
import Debug from "debug";

var conf = Rc('surly2', {
    brain: '',      b: '',
    help: false,
    version: false
});
const debug = Debug('surly2');

var options = {
    brain: conf.b || conf.brain || __dirname + '/data/aiml',
    help: conf.help || conf.h,
    version: conf.version,
};

var prompt = 'You: ';

if (options.help) {
    console.log('Surly chat bot command line interface\n\n' +
        'Options: \n' +
        '  -b, --brain       AIML directory (aiml/)\n' +
        '  --help            Show this help message\n' +
        '  --version         Show version number');
    process.exit();
}

if (options.version) {
    console.log(pkg.version);
    process.exit();
}

var bot = new Surly({
  brain: options.brain
});

console.log('Surly: Hello! Type quit to quit or /help for unhelpful help.');
process.stdout.write(prompt);

process.stdin.addListener('data', function (d) {
	var sentence = d.toString().substring(0, d.length - 1);

	if (sentence === 'quit' || sentence === 'exit') {
		console.log('Yeah, fuck off.');
		process.exit(0);
	}

  bot.talk(sentence, function (err, response) {
    console.log('Surly: ' + response);
    process.stdout.write(prompt);
  });
});
