import substitutions from "../data/substitutions.json" with { type: "json" };
import Debug from "debug";

const debug = Debug("DEBUG");

/**
 * Swap words in a given sentence from a given set of pairs.
 * @param  {String} sentence Sentence to update
 * @param  {String} set      Set of substitutions to use
 * @return {String}          Updated sentence
 */
export default function substitute(sentence, set) {
  debug("Substitutions - ", sentence, set);
  let x;
  let y;
  const words = sentence.split(" ");

  if (typeof substitutions[set] === "undefined") {
    throw "Invalid set.";
  }

  return words
    .map((chunk) => {
      const word = chunk.toLowerCase();

      if (typeof substitutions[set][word] !== "undefined") {
        return substitutions[set][word];
      }

      return;
    })
    .filter((x) => !!x)
    .join(" ");
}
