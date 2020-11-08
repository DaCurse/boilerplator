/**
 * Wraps commands in a try/catch to print any thrown errors
 * @param {Function} cmd Command to run
 * @param  {...any} args Args to pass to command
 */
module.exports = (cmd, ...args) => {
  try {
    cmd(...args);
  } catch (error) {
    console.error(`error: ${error.message}`);
  }
};
