const { execSync } = require('child_process');
const { join } = require('path');

/**
 * Runs a binary with the given args
 * @param {string} script Binary file name
 * @param {string} args Command like arguments
 */
global.execBinary = (script, args) => {
  const scriptPath = join(process.cwd(), script);
  execSync(`node ${scriptPath} ${args}`);
};
