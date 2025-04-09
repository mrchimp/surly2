import BaseNode from '../BaseNode.js';

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-uppercase
 *
 * The uppercase element tells the AIML interpreter to render the contents of
 * the element in uppercase, as defined (if defined) by the locale indicated by
 * the specified language (if specified).
 *
 * <!-- Category: aiml-template-elements -->
 * <aiml:uppercase>
 *    <!-- Contents: aiml-template-elements -->
 * </aiml:uppercase>
 *
 * If no character in this string has a different uppercase version, based on
 * the Unicode standard, then the original string is returned.
 *
 * See Unicode Case Mapping for implementation suggestions.
 */
export default class Uppercase extends BaseNode {
  getText (callback) {
    this.evaluateChildren(function (err, text) {
      callback(err, text.toUpperCase());
    });
  }
};
