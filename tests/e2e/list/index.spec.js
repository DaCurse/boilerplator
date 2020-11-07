const { readdirSync } = require('fs');
const { join } = require('path');
const { isDirectorySync } = require('path-type');

const script = 'bin/boil list';
const execBinary = global.execBinary.bind(null, script);

describe(script, () => {
  it('should list all templates', () => {
    const configPath = join(__dirname, 'config.json');
    const templateDir = join(__dirname, 'templates');
    const output = execBinary(`--config ${configPath}`).toString();

    const templates = readdirSync(templateDir).filter((path) =>
      isDirectorySync(join(templateDir, path))
    );
    const templateList = templates.map((t) => '- ' + t).join('\n');

    expect(output).toEqual(expect.stringContaining(templateList));
  });
});
