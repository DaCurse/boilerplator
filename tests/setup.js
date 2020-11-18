const { execSync } = require('child_process');
const { join } = require('path');

/**
 * Runs a command with the given args and loads custom dotenv file
 * @param {string} cmd Command name
 * @param {string} args Command like arguments
 * @param {string} envPath Path to a testing .env file
 */
global.execCommand = (cmd, args, envPath) => {
  const cmdPath = join(process.cwd(), cmd);
  return execSync(
    `node -r dotenv/config ${cmdPath} ${args} dotenv_config_path=${envPath}`
  );
};
