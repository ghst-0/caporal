import levenshtein from 'fast-levenshtein';
import * as c from 'colorette';

/**
 *
 * @param {string} input - User input
 * @param {string[]} possibilities - Possibilities to retrieve suggestions from
 * @returns {*}
 */
const getSuggestions = (input, possibilities) => {
  return possibilities
    .map(p => {
      return {suggestion: p,  distance: levenshtein.get(input, p)};
    })
    .filter(p => p.distance <= 2)
    .sort((a, b) => a.distance - b.distance)
    .map(p => p.suggestion);
};

 const getBoldDiffString = (from, to) => {
  return to.split('').map((char, index) => {
    if (char !== from.charAt(index)) {
      return c.bold(char);
    }
    return char;
  }).join('')
};

export { getSuggestions, getBoldDiffString };
