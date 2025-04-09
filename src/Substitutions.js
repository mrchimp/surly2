import substitutions from '../data/substitutions.json' with { type: "json" };

/**
 * Swap words in a given sentence from a given set of pairs.
 * @param  {String} sentence Sentence to update
 * @param  {String} set      Set of substitutions to use
 * @return {String}          Updated sentence
 */
export default function substitute(sentence, set) {
  var x, y, chunks = sentence.split(' ');

  if (typeof substitutions[set] === 'undefined') {
    throw 'Invalid set.';
  }

  for (x = 0; x < chunks.length; x++) {
    if (typeof substitutions[set][chunks[x].toLowerCase()] !== 'undefined') {
      chunks[x] = substitutions[set][chunks[x].toLowerCase()];
    }
  }

  return chunks.join(' ');
};
