#!/usr/bin/env node

import pkg from "./package.json" with { type: "json" };
import Surly from "./src/Surly.js";
import Rc from "rc";
import Debug from "debug";

const __dirname = import.meta.dirname;

const conf = Rc("surly2", {
  brain: "",
  b: "",
  help: false,
  version: false,
});
const debug = Debug("DEBUG");

const options = {
  brain: conf.b || conf.brain || __dirname + "/data/aiml",
  help: conf.help || conf.h,
  version: conf.version,
};

const prompt = "You: ";

if (options.help) {
  console.log(
    "Surly chat bot command line interface\n\n" +
      "Options: \n" +
      "  -b, --brain       AIML directory (aiml/)\n" +
      "  --help            Show this help message\n" +
      "  --version         Show version number",
  );
  process.exit();
}

if (options.version) {
  console.log(pkg.version);
  process.exit();
}

const bot = new Surly({
  brain: options.brain,
});

console.log("Surly: Hello! Type quit to quit or /help for unhelpful help.");
process.stdout.write(prompt);

process.stdin.addListener("data", function (d) {
  const sentence = d.toString().substring(0, d.length - 1);

  if (sentence === "quit" || sentence === "exit") {
    console.log("Yeah, fuck off.");
    process.exit(0);
  }

  const response = bot.talk(sentence);
  process.stdout.write("Surly: " + response);
  process.stdout.write(prompt);
});
