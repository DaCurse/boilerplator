const { execSync } = require('child_process');
const { join } = require('path');

/**
 * Runs a binary with the given args, loads custom dotenv file
 * @param {string} script Binary file name
 * @param {string} args Command like arguments
 * @param {string} envPath Path to a testing .env file
 */
global.execBinary = (script, args, envPath) => {
  const scriptPath = join(process.cwd(), script);
  return execSync(
    `node -r dotenv/config ${scriptPath} ${args} dotenv_config_path=${envPath}`
  );
};
