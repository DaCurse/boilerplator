const { execSync } = require('child_process');
const { join } = require('path');

/**
 * Runs a command with the given args and loads custom dotenv file
 * @param {string} cmd Command name
 * @param {string} args Command like arguments
 * @param {string} envPath Path to a testing .env file
 * @param {object} options Options for `execSync`
 */
global.execCommand = (cmd, args, envPath, options) => {
  const cmdPath = join(process.cwd(), cmd);
  return execSync(
    `node -r dotenv/config ${cmdPath} dotenv_config_path=${envPath} ${args}`,
    options
  );
};
