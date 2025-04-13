import pkg from "../../../package.json" with { type: "json" };
import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-system-defined-predicates
 *
 * The version element tells the AIML interpreter that it should substitute the
 * version number of the AIML interpreter.
 *
 * The version element does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:version/>
 */
export default class Version extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "version";
  }

  getType() {
    return this.type;
  }

  toString() {
    return pkg.version;
  }
}
