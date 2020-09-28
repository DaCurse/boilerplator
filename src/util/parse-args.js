/**
 * Serializes args in the format "argName=value..." to a `Map<string,string>` of
 * placeholders, including `defaultPlaceholders`
 * @param {Array<string>} args
 * @param {Object} defaultPlaceholders
 */
module.exports = (args, defaultPlaceholders = {}) =>
  args.reduce((placeholders, arg) => {
    // We only care about the first delimiter
    const delimeterIndex = arg.indexOf('=');
    if (delimeterIndex === -1) {
      return placeholders;
    }

    return placeholders.set(
      arg.slice(0, delimeterIndex),
      arg.slice(delimeterIndex + 1)
    );
  }, new Map(Object.entries(defaultPlaceholders)));
