#!/usr/bin/env node
import pkg from "./package.json" with { type: "json" };
import Surly from "./src/Surly.js";
import Rc from "rc";
import Debug from "debug";
import "dotenv/config";

const username = process.env.USER || "";
const __dirname = import.meta.dirname;

const conf = Rc("surly2", {
  help: false,
  version: false,
});
const debug = Debug("DEBUG");

const options = {
  help: conf.help || conf.h,
  version: conf.version,
};

debug("Options", options);

if (options.help) {
  console.log(
    "Surly chat bot command line interface\n\n" +
      "Options: \n" +
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
  brain: process.env.SURLY_BRAIN,
});

const inputContext = {
  username,
  isDM: "TRUE",
  isVoiceChat: "FALSE",
};

// @todo get a signal that data is loaded rather than using a timeout
setTimeout(() => {
  process.stdout.write(
    "Surly: Hello! Type quit to quit or /help for unhelpful help.",
  );
  process.stdout.write(`You: ${input}`);
  const response = bot.talk(input, inputContext);
  process.stdout.write(`Surly: ${response}\n`);
}, 1000);
