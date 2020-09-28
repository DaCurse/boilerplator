const { cosmiconfigSync } = require('cosmiconfig');
const { homedir } = require('os');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { name } = require('../package.json');

const defaultFilename = `.${name}rc`;

const defaultConfig = {
  templateFolder: '',
  createRepository: false,
  defaultPlaceholders: {},
  placeholderRegex: '{{([\\w-_]+)}}',
};

/**
 * Loads config from a dotfile and merges `defaultConfig`
 */
module.exports = (baseDir = homedir()) => {
  const explorer = cosmiconfigSync(name);
  const result = explorer.search(baseDir);

  if (!result || result.isEmpty) {
    const filepath = join(baseDir, defaultFilename);
    console.info(
      `Config file not found! Creating default config at ${filepath}.`
    );
    writeFileSync(filepath, JSON.stringify(defaultConfig, null, 2));
    return { config: defaultConfig, filepath };
  }

  return { ...result, config: { ...defaultConfig, ...result.config } };
};
