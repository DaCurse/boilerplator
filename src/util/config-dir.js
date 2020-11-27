const { join } = require('path');
const { name } = require('../../package.json');
require('dotenv').config();

/**
 * Returns User-level configuration directory based on `platform`, or the config
 * directory stored in the environment
 * @param {string} moduleName Name for sub-directory under the base path
 * @param {string} platform
 */
module.exports = (moduleName = name, platform = process.platform) => {
  if (process.env.CONFIG_DIR) {
    return process.env.CONFIG_DIR;
  }

  const platforms = {
    win32: process.env.APPDATA,
    darwin: join(process.env.HOME, '/Library/Application Support'),
    linux: process.env.XDG_CONFIG_HOME || join(process.env.HOME, '.config'),
  };

  return platforms[platform] ? join(platforms[platform], moduleName) : null;
};
