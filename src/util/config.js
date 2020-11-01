const { cosmiconfigSync } = require('cosmiconfig');
const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const { isDirectorySync, isFileSync } = require('path-type');
const { name } = require('../../package.json');
const configDir = require('./config-dir');

// Default config filename
const defaultFilename = 'config.json';

const defaultConfig = {
  templateDirectory: '',
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
function loadConfig(basePath = join(configDir(), name)) {
  const explorer = cosmiconfigSync(name, { searchPlaces });
  // Check if a config file is provided
  if (isFileSync(basePath)) {
    return explorer.load(basePath);
  }

  // Otherwise search for it in the provided directory
  const result = explorer.search(basePath);

  if (!result || result.isEmpty) {
    if (!isDirectorySync(basePath)) {
      mkdirSync(basePath);
    }
    const filepath = join(basePath, defaultFilename);

    console.info(
      `Config file not found! Creating default config at ${filepath}.`
    );
    writeFileSync(filepath, JSON.stringify(defaultConfig, null, 2));

    return { config: defaultConfig, filepath };
  }

  return { ...result, config: { ...defaultConfig, ...result.config } };
}

module.exports = {
  defaultFilename,
  defaultConfig,
  loadConfig,
};
