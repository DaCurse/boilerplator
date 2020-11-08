const { execSync } = require('child_process');
const { join } = require('path');

/**
 * Runs a binary with the given args
 * @param {string} script Binary file name
 * @param {string} args Command like arguments
 * @param {string} nodeArgs Extra arguments for node
 */
global.execBinary = (script, args, nodeArgs = '') => {
  const scriptPath = join(process.cwd(), script);
  return execSync(`node ${nodeArgs + ' '}${scriptPath} ${args}`);
};
