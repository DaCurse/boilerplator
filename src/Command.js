const commander = require('commander');

module.exports = class Command extends commander.Command {
  action(fn) {
    return super.action((options) => {
      try {
        fn(options);
      } catch (e) {
        console.error('error:', e.message);
      }
    });
  }
};
