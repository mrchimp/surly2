import BaseNode from "../BaseNode.js";

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

  getText() {
    switch (this.action) {
      case "list":
        return (
          "I am carrying " + this.surly.environment.inventory.join(", ") + "."
        );
      case "swap":
        let text = super.evaluateChildren();
        var dropped = this.surly.environment.inventoryPush(text);
        this.surly.environment.setVariable("last_dropped", dropped);
        return "";
      default:
        return "Invalid inventory action: " + this.action, "[ERROR!]";
    }
  }
}
