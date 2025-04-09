import BaseNode from '../BaseNode.js';

/**
 * Not part of the AIML Spec.
 *
 * Handles a list of items that the bot can hold onto.
 */
export default class Inventory extends BaseNode{
  constructor (node, surly) {
    super(node, surly);
    this.type = 'inventory';
    this.action = node.getAttribute('action')?.value();
  }

  getText (callback) {
    switch (this.action) {
      case 'list':
        callback(null, 'I am carrying ' + this.surly.environment.inventory.join(', ') + '.');
        break;
      case 'swap':
        super.evaluateChildren(function (err, text) {
          var dropped = this.surly.environment.inventoryPush(text);
          this.surly.environment.setVariable('last_dropped', dropped);
          callback(null, '');
        }.bind(this));
        break;
      default:
        callback('Invalid inventory action: ' + this.action, '[ERROR!]');
    }
  }
};
