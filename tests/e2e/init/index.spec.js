const { unlinkSync } = require('fs');
const { join } = require('path');
const { isFileSync } = require('path-type');

const script = 'bin/boil init';
const execBinary = global.execBinary.bind(null, script);

describe(script, () => {
  const configPath = join(__dirname, 'config.json');

  afterEach(() => unlinkSync(configPath));

  it('should create the config file', () => {
    const templateDir = join(__dirname, 'templates');
    const envPath = join(__dirname, '.env');
    execBinary(`-t ${templateDir}`, envPath);

    expect(isFileSync(configPath)).toBeTruthy();
  });
});