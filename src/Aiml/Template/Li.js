import BaseNode from '../BaseNode.js';

/**
 * A generic container element use in conditionals and the Random element.
 */
export default class Li extends BaseNode {
  constructor (node, surly) {
    super(node, surly);
    this.type = 'li';

    var name = node.attr('name');
    if (name !== null) this.name = name.value();

    var value = node.attr('value');
    if (value !== null) this.value = value.value();
  }
};
