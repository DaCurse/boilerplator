/**
 * Wraps commands in a try/catch to print any thrown errors
 * @param {Function} cmd
 * @param  {...any[]} args
 */
module.exports = (cmd, ...args) => {
  try {
    cmd(...args);
  } catch (error) {
    console.error(`error: ${error.message}`);
  }
};
