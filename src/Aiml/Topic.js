import Category from "./Category.js";

/**
 * From AIML Spec
 * http://www.alicebot.org/TR/2001/WD-aiml/#section-topic
 *
 * A topic is an optional top-level element that contains category elements.
 * A topic element has a required name attribute that must contain a simple
 * pattern expression. A topic element may contain one or more category
 * elements.
 *
 * The contents of the topic element's name attribute are appended to the full
 * match path that is constructed by the AIML interpreter at load time, as
 * described in [8.2].
 *
 * <!-- Category: top-level-element -->
 * <aiml:topic name = aiml-simple-pattern-expression >
 *    <!-- Content: aiml:category+ -->
 * </aiml:topic>
 */
export default class Topic {
  constructor(node, surly) {
    const topicName = node.getAttribute("name").value();
    const categories = node.find("category");

    for (let i = 0; i < categories.length; i++) {
      this.log.debug("Found category in topic");
      this.surly.aiml.categories.push(new Category(categories[i]));
    }
  }
}
