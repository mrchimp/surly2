import BaseNode from "../BaseNode.js";
import Debug from "debug";

const debug = Debug("DEBUG");

/**
 * Not part of the AIML Spec.
 *
 * Handles a list of items that the bot can hold onto.
 */
export default class Inventory extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "inventory";
    this.action = node.getAttribute("action")?.value();
  }

  eval(inputContext) {
    switch (this.action) {
      case "list":
        return (
          "I am carrying " + this.surly.environment.inventory.join(", ") + "."
        );
      case "swap":
        let text = super.evaluateChildren(inputContext);
        debug("Inventory - text: " + text);
        const dropped = this.surly.environment.inventoryPush(text);
        debug("Inventory - dropped", dropped);
        this.surly.environment.setVariable("last_dropped", dropped);
        debug("Inventory", this.surly.environment.inventory);
        return "";
      default:
        return "Invalid inventory action: " + this.action, "[ERROR!]";
    }
  }
}
