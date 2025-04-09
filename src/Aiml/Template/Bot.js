import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-bot
 *
 * An element called bot, which may be considered a restricted version of get,
 * is used to tell the AIML interpreter that it should substitute the contents
 * of a "bot predicate". The value of a bot predicate is set at load-time, and
 * cannot be changed at run-time. The AIML interpreter may decide how to set the
 * values of bot predicate at load-time. If the bot predicate has no value
 * defined, the AIML interpreter should substitute an empty string.
 *
 * The bot element has a required name attribute that identifies the
 * bot predicate.
 *
 * The bot element does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:bot name = aiml-predicate-name />
 */
export default class Bot extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "bot";
    this.name = node.getAttribute("name")?.value() || "BOT"; // @todo DO SOMETHING ELSE!

    if (!this.name) {
      throw "Invalid AIML: Bot tag with no name attribute.";
    }
  }

  getText(callback) {
    callback(null, this.surly.environment.getBot(this.name));
  }
}
