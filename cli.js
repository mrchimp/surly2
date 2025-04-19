#!/usr/bin/env node

import pkg from "./package.json" with { type: "json" };
import Surly from "./src/Surly.js";
import Rc from "rc";
import Debug from "debug";
import "dotenv/config";

const username = process.env.USER || "";
const __dirname = import.meta.dirname;

const conf = Rc("surly2", {
  b: "",
  help: false,
  version: false,
});
const debug = Debug("DEBUG");

const options = {
  help: conf.help || conf.h,
  version: conf.version,
};

const prompt = "You: ";

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

const bot = new Surly({
  brain: process.env.SURLY_BRAIN,
});

console.log("Surly: Hello! Type quit to quit or /help for unhelpful help.");
process.stdout.write(prompt);

const inputContext = {
  username,
  isDM: "TRUE",
  isVoiceChat: "FALSE",
};

process.stdin.addListener("data", function (d) {
  const sentence = d.toString().substring(0, d.length - 1);

  if (sentence === "quit" || sentence === "exit") {
    console.log("Yeah, fuck off.");
    process.exit(0);
  }

  console.log("Input Context");
  console.log(inputContext);
  process.exit();

  const response = bot.talk(sentence, inputContext);
  process.stdout.write(`Surly: ${response}\n`);
  process.stdout.write(prompt);
});
