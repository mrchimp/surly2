import fs from "fs";

const __dirname = import.meta.dirname;

export default class Logger {
  /**
   * Log a message to the log file
   * @param  {String} msg
   */
  log(msg) {
    // @todo - find out why appendFile (not sync) sometimes fails
    fs.appendFileSync(__dirname + "/../logs/surly.log", msg + "\n");
  }

  /**
   * Output text to console with indents to make it stand out
   * @param  {String}    msg Message to output. Multiple messages will be concatenated.
   * @return {Undefined}
   */
  debug(msg) {
    this.log("DEBUG - " + Array.prototype.join.call(arguments, " "));
  }
}
