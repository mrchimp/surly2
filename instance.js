#!/usr/bin/env node

import Surly from "./src/Surly.js";
import "dotenv/config";

export default new Surly({
  brain: process.env.SURLY_BRAIN,
});
