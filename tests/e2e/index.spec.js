const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');
const { isFileSync } = require('path-type');
const rimraf = require('rimraf');
const simpleGit = require('simple-git');

/**
 * Serializes `placeholders` into a string for the CLI script
 * @param {object} placeholders
 */
function serializePlaceholders(placeholders) {
  return Object.keys(placeholders).reduce(
    (str, key) => str + `${key}=${placeholders[key].toString()} `,
    ''
  );
}

/**
 * Runs the CLI script with the given parameters
 * @param {string} template Name of the template
 * @param {string} dest Destination directory
 * @param {string} config Config file path
 * @param {object} placeholders Placeholder object to serialize
 */
function execScript(template, dest, config, placeholders) {
  const scriptPath = join(process.cwd(), 'bin/cli.js');
  execSync(
    `node ${scriptPath} ${template} -d ${dest} --config ${config} --force ${serializePlaceholders(
      placeholders
    )}`
  );
}

/**
 * Recursively deletes a directory
 * @param {string} path Path to clean up
 * @param {string} cwd Working directory
 */
function cleanUp(path, cwd = __dirname) {
  rimraf.sync(join(cwd, path));
}

describe('e2e test for cli tool', () => {
  afterEach(() => {
    cleanUp('dest/simple');
    cleanUp('dest/nested');
  });

  it('should create a project from the simple template', () => {
    const placeholders = {
      p1: 'foo',
      p2: 'bar',
    };
    const dest = join(__dirname, 'dest/simple');
    const configPath = join(__dirname, 'simple.json');
    execScript('simple', dest, configPath, placeholders);

    expect(isFileSync(join(dest, placeholders.p1))).toBeTruthy();

    const fileToRead = join(dest, 'file');
    expect(isFileSync(fileToRead)).toBeTruthy();
    expect(readFileSync(fileToRead, 'utf-8')).toBe(placeholders.p2);

    expect(isFileSync(join(dest, `${placeholders.p2}/file2`))).toBeTruthy();
  });

  it('should create a project from the nested template', async () => {
    const placeholders = {
      foo: '1',
      qux: '2',
    };
    const dest = join(__dirname, 'dest/nested');
    const configPath = join(__dirname, 'nested.json');
    execScript('nested', dest, configPath, placeholders);

    const fileToRead = join(dest, `${placeholders.foo}/bar/baz/file`);
    expect(isFileSync(fileToRead)).toBeTruthy();
    expect(readFileSync(fileToRead, 'utf-8')).toBe(placeholders.qux);

    // Test if git repository was created as configured
    const { gitOptions } = require('./nested.json');
    const git = simpleGit();
    git.cwd(dest);
    const commits = await git.log();
    expect(commits.latest.message).toBe(gitOptions.initialCommit);
  });
});
