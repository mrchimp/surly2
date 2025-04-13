import BaseNode from "../BaseNode.js";
import libxmljs from "libxmljs";
import substitute from "../../Substitutions.js";
import Star from "./Star.js";

/**
 * From AIML Spec. Handles both the transformational GENDER element and
 * the GENDER shortcut element
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-gender
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-short-cut-elements
 *
 *
 * SHORTCUT
 *
 * The atomic version of the gender element is a shortcut for:
 *
 * <gender><star/></gender>
 *
 * The atomic gender does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:gender/>
 *
 * NB: Previous versions of AIML (dubbed "0.9") used <aiml:gender/> to indicate
 * that the AIML interpreter should return the value of the bot predicate
 * "gender". Vendors who wish to implement an AIML interpreter that is
 * compatible with old AIML sets written with this usage should take note.
 *
 *
 * TRANSFORMATIONAL
 *
 * The gender element instructs the AIML interpreter to:
 *
 *     1. replace male-gendered words in the result of processing the contents
 *        of the gender element with the grammatically-corresponding
 *        female-gendered words; and
 *     2. replace female-gendered words in the result of processing the contents
 *        of the gender element with the grammatically-corresponding
 *        male-gendered words.
 *
 * The definition of "grammatically-corresponding" is left up to the
 * implementation
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:gender>
 *    <!-- Contents: aiml-template-elements -->
 * </aiml:gender>
 *
 * Historically, implementations of gender have exclusively dealt with pronouns,
 * likely due to the fact that most AIML has been written in English. However,
 * the decision about whether to transform gender of other words is left up to
 * the implementation.
 */
export default class Gender extends BaseNode {
  constructor(node, surly) {
    super(node, surly);
    this.type = "gender";

    if (node.childNodes().length === 0) {
      const star = new libxmljs.Element(node.doc(), "star");
      this.children.push(new Star(star, surly));
    }
  }

  toString() {
    return substitute(this.evaluateChildren(), "gender");
  }
}
