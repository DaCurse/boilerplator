const { cosmiconfigSync } = require('cosmiconfig');
const { isFileSync } = require('path-type');
const { name } = require('../../package.json');
const configDir = require('./config-dir');

// Default config filename
const defaultFilename = 'config.json';

const defaultConfig = {
  placeholderRegex: '{{([\\w-_]+)}}',
  defaultPlaceholders: {},
  gitOptions: { createRepository: false },
};

// Valid config filenames
const searchPlaces = ['config.json', 'config.js', 'config.cjs'];

/**
 * Loads config from a dotfile in `basePath` and merges `defaultConfig`. If
 * `basePath` is a file, it will try to load the config from it
 */
function loadConfig(basePath = configDir()) {
  const explorer = cosmiconfigSync(name, { searchPlaces });
  // Check if a config file is provided
  if (isFileSync(basePath)) {
    return explorer.load(basePath);
  }

  // Otherwise search for it in the provided directory
  const result = explorer.search(basePath);
  if (!result || result.isEmpty) {
    return null;
  }

  return { ...result, config: { ...defaultConfig, ...result.config } };
}

module.exports = {
  defaultFilename,
  defaultConfig,
  loadConfig,
};
