const copy = require('recursive-copy');
const tree = require('tree-node-cli');
const simpleGit = require('simple-git');
const fileTransformer = require('./util/file-transformer');
const applyPlaceholders = require('./util/apply-placeholders');

/**
 * Generates a project from a template in `templatePath` in `destination`,
 * applying placeholders in `placeholders`. Creating a git repository and an
 * initial commit based on `gitOptions` and overwriting the directory in
 * `destination` if `overwrite` is `true`.
 * @param {string} templatePath
 * @param {string} destination
 * @param {Map<string, string>} placeholders
 * @param {RegExp} placeholderRegex
 * @param {{createRepository: boolean, initialCommit: string}} gitOptions
 * @param {boolean} overwrite
 * @see applyPlaceholders
 */
module.exports = async (
  templatePath,
  destination,
  placeholders,
  placeholderRegex,
  gitOptions = { createRepository: false },
  overwrite = false
) => {
  try {
    await copy(templatePath, destination, {
      overwrite,
      rename: applyPlaceholders.bind(null, placeholders, placeholderRegex),
      transform: fileTransformer(placeholders, placeholderRegex),
    });
  } catch (error) {
    console.error(`Failed to copy some files: ${error}`);
  }

  // Print directory tree
  console.log(tree(destination));
  // Create git repository and commit files if configured to do so
  if (gitOptions.createRepository) {
    const git = simpleGit({
      baseDir: destination,
      binary: 'git',
    });

    await git.init();
    console.info('Initialized empty git repository.');

    if (gitOptions.initialCommit) {
      await git.add('.');
      await git.commit(gitOptions.initialCommit);
      console.info(`Created initial commit "${gitOptions.initialCommit}".`);
    }
  }
};
