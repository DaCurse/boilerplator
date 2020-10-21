const { Transform } = require('stream');
const applyPlaceholders = require('./apply-placeholders');

/**
 * A file transformer that applies placeholders to the file contents using
 * `applyPlaceholders`
 * @param {Map<string, string>} placeholders
 * @param {RegExp} placeholderRegex
 * @see applyPlaceholders
 */
module.exports = (placeholders, placeholderRegex) => () =>
  new Transform({
    transform(chunk, _encoding, done) {
      // Replace all placeholders with their value
      const data = applyPlaceholders(
        placeholders,
        placeholderRegex,
        chunk.toString()
      );

      done(null, data);
    },
  });
