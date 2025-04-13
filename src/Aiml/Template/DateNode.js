import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-system-defined-predicates
 *
 * The date element tells the AIML interpreter that it should substitute the
 * system local date and time. No formatting constraints on the output
 * are specified.
 *
 * The date element does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:date/>
 */
export default class DateNode extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "date";
  }

  toString() {
    return new Date().toISOString(); // @todo - nice formatting
  }
}
