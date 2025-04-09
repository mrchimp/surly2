import BaseNode from '../BaseNode.js';

/**
 * From AIML Spec. Handles both the transformational PERSON2 element and
 * the PERSON2 shortcut element
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-person2
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-short-cut-elements
 *
 *
 * SHORTCUT
 *
 * The atomic version of the person2 element is a shortcut for:
 *
 * <person2><star/></person2>
 *
 * The atomic person2 does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:person2/>
 *
 *
 * TRANSFORMATIONAL
 *
 * The person2 element instructs the AIML interpreter to:
 *
 *    1. replace words with first-person aspect in the result of processing the
 *       contents of the person2 element with words with the
 *       grammatically-corresponding second-person aspect; and
 *    2. replace words with second-person aspect in the result of processing the
 *       contents of the person2 element with words with the
 *       grammatically-corresponding first-person aspect.
 *
 * The definition of "grammatically-corresponding" is left up to the
 * implementation.
 *
 * <!-- Category: aiml-template-elements -->
 *
 * <aiml:person2>
 *    <!-- Contents: aiml-template-elements -->
 * </aiml:person2>
 *
 * Historically, implementations of person2 have dealt with pronouns, likely due
 * to the fact that most AIML has been written in English. However, the decision
 * about whether to transform the person aspect of other words is left up to the
 * implementation.
 */
export default class Person2 extends BaseNode {
  constructor (node, surly) {
    super(node, surly);
    this.type = 'person2';

    if (node.childNodes().length === 0) {
      var star = new libxmljs.Element(node.doc(), 'star');
      this.children.push(new Star(star, surly));
    }
  }

  getText (callback) {
    this.evaluateChildren(function (err, text) {
      callback(err, substitute(text, 'person2'));
    });
  }
};

const libxmljs = require('libxmljs');
const substitute = require('../../Substitutions');
const Star = require('./Star');
