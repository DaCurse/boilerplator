const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const stringifyObject = require('stringify-object');
const jsesc = require('jsesc');

const script = 'bin/boil config';
const envPath = join(__dirname, '.env');
const execCommand = (args, options) =>
  global.execCommand(script, args, envPath, options);

describe(script, () => {
  it('should print config', () => {
    const configPath = join(__dirname, 'config.json');
    const output = execCommand().toString();

    const config = JSON.parse(readFileSync(configPath));
    // Stringify the config to match the same output when using console.log on
    // an object
    const expectedOutput = stringifyObject(config, {
      indent: '  ',
      singleQuotes: true,
      transform(_object, _property, result) {
        // Escape special characters except single quotes, to match console
        // output which is a valid string literal wrapped in double quotes.
        return jsesc(result, { quotes: 'double' });
      },
    });

    expect(output).toEqual(expect.stringContaining(expectedOutput));
  });

  describe('with directory option', () => {
    const envContents = readFileSync(envPath);

    afterEach(() => writeFileSync(envPath, envContents));

    it('should set custom config directory to env file', () => {
      const customDir = join(__dirname, 'foo');
      execCommand(`-d ${customDir}`, { cwd: __dirname });

      expect(readFileSync(envPath, 'utf-8')).toEqual(
        expect.stringContaining(`CONFIG_DIR=${customDir}`)
      );
    });

    it('should reset env file', () => {
      execCommand(`-d`, { cwd: __dirname });
      expect(readFileSync(envPath, 'utf-8').length).toBe(0);
    });
  });
});
