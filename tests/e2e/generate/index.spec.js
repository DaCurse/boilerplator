const { readFileSync } = require('fs');
const { join } = require('path');
const { isFileSync } = require('path-type');
const rimraf = require('rimraf');
const simpleGit = require('simple-git');

const script = 'bin/boil generate';
const envPath = join(__dirname, '.env');
const execCommand = (args) => global.execCommand(script, args, envPath);

/**
 * Serializes `placeholders` into a string for the binary
 * @param {object} placeholders
 */
function serializePlaceholders(placeholders) {
  return Object.keys(placeholders).reduce(
    (str, key) => str + `${key}=${placeholders[key].toString()} `,
    ''
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

describe(script, () => {
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
    execCommand(
      `-t simple -d ${dest} --force ${serializePlaceholders(placeholders)}`
    );

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
    execCommand(
      `-t nested -d ${dest} --force ${serializePlaceholders(placeholders)}`
    );

    const fileToRead = join(dest, `${placeholders.foo}/bar/baz/file`);
    expect(isFileSync(fileToRead)).toBeTruthy();
    expect(readFileSync(fileToRead, 'utf-8')).toBe(placeholders.qux);

    // Test if git repository was created as configured
    const { gitOptions } = require('./config.json');
    const git = simpleGit();
    git.cwd(dest);
    const commits = await git.log();
    expect(commits.latest.message).toBe(gitOptions.initialCommit);
  });
});
