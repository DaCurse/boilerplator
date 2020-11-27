const { readdirSync } = require('fs');
const { join } = require('path');
const { isDirectorySync } = require('path-type');

const script = 'bin/boil list';
const execCommand = global.execCommand.bind(null, script);

describe(script, () => {
  it('should list all templates', () => {
    const templateDir = join(__dirname, 'templates');
    const envPath = join(__dirname, '.env');
    const output = execCommand('', envPath).toString();

    const templates = readdirSync(templateDir).filter((path) =>
      isDirectorySync(join(templateDir, path))
    );
    const templateList = templates.map((t) => '- ' + t).join('\n');

    expect(output).toEqual(expect.stringContaining(templateList));
  });
});
