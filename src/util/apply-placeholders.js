/**
 * Replaces all placeholders in `str` based on `placeholderRegex` with their
 * respective value (if present) from `placeholders`
 * @param {Map<string, string>} placeholders
 * @param {RegExp} placeholderRegex
 * @param {string} str
 */
module.exports = (placeholders, placeholderRegex, str) =>
  str.replace(placeholderRegex, (match, placeholder) => {
    const placeholderValue = placeholders.get(placeholder);
    if (!placeholderValue) {
      console.warn(`No value provided for placeholder '${placeholder}'.`);
      return match;
    }

    return placeholderValue;
  });
