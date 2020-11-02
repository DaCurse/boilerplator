/**
 * Allows using an in-memory filesystem with memfs ontop of the regular one
 */
const fs = jest.requireActual('fs');
const { default: unionfs } = require('unionfs');

unionfs.reset = () => {
  unionfs.fss = [fs];
};

module.exports = unionfs.use(fs);
