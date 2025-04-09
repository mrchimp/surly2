import BaseNode from '../BaseNode.js';

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-input
 *
 * The input element tells the AIML interpreter that it should substitute the
 * contents of a previous user input.
 *
 * The template-side input has an optional index attribute that may contain
 * either a single integer or a comma-separated pair of integers. The minimum
 * value for either of the integers in the index is "1". The index tells the
 * AIML interpreter which previous user input should be returned (first
 * dimension), and optionally which "sentence" (see [8.3.2.]) of the
 * previous user input.
 *
 * The AIML interpreter should raise an error if either of the specified index
 * dimensions is invalid at run-time.
 *
 * An unspecified index is the equivalent of "1,1". An unspecified second
 * dimension of the index is the equivalent of specifying a "1" for
 * the second dimension.
 *
 * The input element does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:input index = (single-integer-index | comma-separated-integer-pair) />
 */
export default class That extends BaseNode {
  constructor (node, surly) {
    var index;

    super(node, surly);
    this.type = 'that';

    if (node.getAttribute('index') === null) {
      index = '1,1';
    } else {
      index = node
        .getAttribute('index')
        .value();
    }

    index = index.split(',');

    if (index.length === 2) {
      this.sentence = parseInt(index[1], 10);
    } else {
      this.sentence = 1;
    }

    this.index = parseInt(index[0], 10);
  }

  getText (callback) {
    callback(null, this.surly.environment.getPreviousInput(this.index, this.sentence));
  }
};
