import BaseNode from "../BaseNode.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-system-defined-predicates
 *
 * The size element tells the AIML interpreter that it should substitute the
 * number of categories currently loaded.
 *
 * The size element does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:size/>
 */
export default class Size extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
  }

  toString() {
    return this.surly.environment.countCategories();
  }
}
