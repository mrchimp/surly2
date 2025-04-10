import pkg from "../../../package.json" with { type: "json" };

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
export default class Version {
  constructor() {
    this.type = "version";
  }

  getType() {
    return this.type;
  }

  getText() {
    return pkg.version;
  }
}
