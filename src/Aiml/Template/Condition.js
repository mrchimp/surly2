import BaseNode from '../BaseNode.js';

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-condition
 *
 * See the URL above for a full description. It works something like this:
 *
 * <!-- blockCondition -->
 * <condition name="foo" value="bar">
 *   Foo is bar!
 * </condition>
 *
 * <!-- singlePredicateCondition -->
 * <condition name="foo">
 *   <li value="bar">Foo is bar!</li>
 *   <li value="baz">Foo is baz!</li>
 * </condition>
 *
 * <!-- multiPredicateCondition -->
 * <condition>
 *   <li name="foo" value="bar">Foo is bar!</li>
 *   <li name="foo" value="baz">Foo is baz!</li>
 * </condition>
 */
export default class Condition extends BaseNode {
  constructor (node, surly) {
    super(node, surly);
    this.type = 'condition';
    var name = node.getAttribute('name');
    var value = node.getAttribute('value');

    if (name !== null && value !== null) {
      this.conditional_type = 'blockCondition';
      this.name = name.value();
      this.value = value.value().toUpperCase();
    } else if (name !== null) {
      this.conditional_type = 'singlePredicateCondition';
      this.filterNonLiChildren();
      this.name = name.value();
      // Set the name on the children, then we can treat it the same as a
      // multiPredicateCondition when we use it later
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].name = this.name;
      }
    } else {
      this.conditional_type = 'multiPredicateCondition';
      this.filterNonLiChildren();
    }
  }

  /**
   * Removes child elements that aren't LI elements.
   */
  filterNonLiChildren () {
    this.children = this.children.filter(function (item) {
      return item.type === 'li';
    });
  }

  getText (callback) {
    switch (this.conditional_type) {
      case 'blockCondition':
        var value = this.surly.environment.getVariable(this.name);

        if (value === this.value) {
          this.evaluateChildren(callback);
        } else {
          callback(null, '');
        }

        break;
      case 'singlePredicateCondition':
      case 'multiPredicateCondition':
        for (var i = 0; i < this.children.length; i++) {
          var actual_value = this.surly.environment.getVariable(this.children[i].name);

          if (actual_value.toUpperCase() === this.children[i].value.toUpperCase()) {
            this.children[i].getText(callback);
            return;
          }
        }
        callback(null, '');
        break;
    }
  }
};
