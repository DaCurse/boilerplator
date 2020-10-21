const { cosmiconfigSync } = require('cosmiconfig');
const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const { isDirectorySync } = require('path-type');
const { name } = require('../../package.json');
const configDir = require('./config-dir');

// Default config filename
const defaultFilename = `.${name}rc`;

const defaultConfig = {
  templateFolder: '',
  placeholderRegex: '{{([\\w-_]+)}}',
  defaultPlaceholders: {},
  gitOptions: { createRepository: false },
};

/**
 * Loads config from a dotfile in `baseDir` and merges `defaultConfig`
 */
function loadConfig(baseDir = join(configDir(), name)) {
  const explorer = cosmiconfigSync(name);
  const result = explorer.search(baseDir);

  if (!result || result.isEmpty) {
    if (!isDirectorySync(baseDir)) {
      mkdirSync(baseDir);
    }
    const filepath = join(baseDir, defaultFilename);

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
