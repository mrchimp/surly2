import BaseNode from '../BaseNode.js';

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-star
 *
 * The star element indicates that an AIML interpreter should substitute the
 * value "captured" by a particular wildcard from the pattern-specified portion
 * of the match path when returning the template.
 *
 * The star element has an optional integer index attribute that indicates which
 * wildcard to use. The minimum acceptable value for the index is "1" (the first
 * wildcard), and the maximum acceptable value is equal to the number of
 * wildcards in the pattern.
 *
 * An AIML interpreter should raise an error if the index attribute of a star
 * specifies a wildcard that does not exist in the category element's pattern.
 * Not specifying the index is the same as specifying an index of "1".
 *
 * The star element does not have any content.
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:star index = single-integer-index />
 */
export default class Star extends BaseNode {
  constructor (node, surly) {
    super(node, surly);

    this.type = 'star';

    if (node.getAttribute('index')) {
      this.index = node.getAttribute('index').value() - 1;
    } else {
      this.index = 0;
    }
  }

  getText (callback) {
    var wildcards = this.surly.environment.wildcard_stack.getLast();

    if (typeof wildcards[this.index] === 'undefined') {
      this.log.log('ERROR: STAR with no matching * value.');
      callback('Star with no matching * value.', 'ERROR!');
    } else {
      callback(null, wildcards[this.index]);
    }
  }
};
