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

debug("Options", options);

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

const input = conf._.join(" ");

if (!input) {
  throw new Error("No input given");
}

const bot = new Surly({
  brain: options.brain,
});

// @todo get a signal that data is loaded rather than using a timeout
setTimeout(() => {
  process.stdout.write(
    "Surly: Hello! Type quit to quit or /help for unhelpful help.",
  );
  process.stdout.write(`You: ${input}`);
  bot.talk(input, function (err, response) {
    process.stdout.write("Surly: " + response);
  });
}, 1000);
