import substitutions from "../data/substitutions.json" with { type: "json" };

/**
 * Swap words in a given sentence from a given set of pairs.
 * @param  {String} sentence Sentence to update
 * @param  {String} set      Set of substitutions to use
 * @return {String}          Updated sentence
 */
export default function substitute(sentence, set) {
  let x;
  let y;
  const chunks = sentence.split(" ");

  if (typeof substitutions[set] === "undefined") {
    throw "Invalid set.";
  }

  const lowerCaseChunks = chunks
    .map((chunk) => {
      const name = chunk.toLowerCase();

      if (typeof substitutions[set][name] !== "undefined") {
        return substitutions[set][name];
      }

      return;
    })
    .filter((x) => !!x)
    .join(" ");
}
