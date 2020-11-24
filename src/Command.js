const commander = require('commander');

class Command extends commander.Command {
  action(fn) {
    return super.action((options) => {
      try {
        fn(options);
      } catch (e) {
        console.error('error:', e.message);
      }
    });
  }
}

module.exports = Command;
