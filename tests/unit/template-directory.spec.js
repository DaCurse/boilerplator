const fs = require('fs');
const { Volume } = require('memfs');
const { join } = require('path');
const templateDirectory = require('../../src/util/template-directory');

jest.mock('fs');

describe('util/template-directory.js', () => {
  afterEach(() => fs.reset());

  it('should return the correct path', () => {
    const vol = Volume.fromJSON({
      templates: {},
    });
    fs.use(vol);

    const path = join(process.cwd(), 'templates');
    expect(templateDirectory(path, process.cwd())).toBe(path);
  });

  it('should return null', () => {
    const path = join(process.cwd(), 'templates');
    expect(templateDirectory(path, process.cwd())).toBeFalsy();
  });

  it('should return an absolute path, provided a relative one', () => {
    const vol = Volume.fromJSON({
      templates: {},
    });
    fs.use(vol);

    const expectedPath = join(process.cwd(), 'templates');
    expect(templateDirectory('templates', process.cwd())).toBe(expectedPath);
  });
});
