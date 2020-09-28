#!/usr/bin/env node

const { program } = require('commander');
const { mkdirSync } = require('fs');
const { resolve, dirname } = require('path');
const { sync: rimraf } = require('rimraf');
const isRegex = require('is-regex');
const copy = require('recursive-copy');
const tree = require('tree-node-cli');
const simpleGit = require('simple-git');
const loadConfig = require('./util/load-config');
const dirExists = require('./util/dir-exists');
const parseArgs = require('./util/parse-args');
const fileTransformer = require('./util/file-transformer');
const applyPlaceholders = require('./util/apply-placeholders');
const { name, version, description } = require('./package.json');
const timeLabel = 'Done';

// Setup commander
program
  .name(name)
  .version(version)
  .description(description)
  .usage('templateName -d <destination> [options] [placeholder1=...,]')
  .requiredOption('-d, --destination <path>', 'destination directory')
  .option('-f, --force', 'overwrite existing directory')
  .parse(process.argv);

console.info(`${program.name()} v${program.version()}`);
// Start measuring time
console.time(timeLabel);

// Load config and validate contents
const { config, filepath: configPath } = loadConfig();
if (!config.templateFolder || !dirExists(config.templateFolder)) {
  console.error(`Template folder specified in ${configPath} is invalid!`);
  process.exit(1);
}

// If templateName is not present, show help and exit
if (program.args.length < 1) {
  console.info(program.help());
}

// Validate destination
if (!dirExists(program.destination)) {
  try {
    mkdirSync(program.destination, { recursive: true });
  } catch (error) {
    console.error(`Failed to create destination directory: ${error}`);
    process.exit(1);
  }
} else if (program.force) {
  // Delete contents of destination directory if force mode is on
  rimraf(resolve(program.destination, '*'));
} else {
  console.error(
    `${program.destination} already exists! Use --force to overwrite the directory.`
  );
  process.exit(1);
}

const templateName = program.args.shift();
console.info(`Finding template '${templateName}'...`);
// Find template folder path, starting from config file's directory to account
// for relative paths. If `config.templateFolder` is an absolute path then the
// first argument will be omitted.
const templatePath = resolve(
  dirname(configPath),
  config.templateFolder,
  templateName
);
if (!dirExists(templatePath)) {
  console.error(`Template '${templateName}' doesn't exist in ${templatePath}.`);
  process.exit(1);
}

// Serialize placeholders into a map
console.info('Parsing placeholders...');
const placeholders = parseArgs(program.args, config.defaultPlaceholders);
const placeholderRegex = isRegex(config.placeholderRegex)
  ? config.placeholderRegex
  : new RegExp(config.placeholderRegex, 'g');

// Recursively copy template files, applying placeholders where applicable
console.info('Copying files...');
copy(templatePath, program.destination, {
  overwrite: program.force,
  rename: applyPlaceholders.bind(null, placeholders, placeholderRegex),
  transform: fileTransformer(placeholders, placeholderRegex),
})
  // Finalizing after copy is done
  .then(async () => {
    // Print directory tree
    console.log(tree(program.destination));
    // Create git repository and commit files if configured to do so
    if (config.createRepository) {
      const git = simpleGit({
        baseDir: program.destination,
        binary: 'git',
      });

      await git.init();
      console.info('Initialized empty git repository.');

      if (config.initialCommit) {
        await git.add('.');
        await git.commit(config.initialCommit);
        console.info(`Created initial commit "${config.initialCommit}".`);
      }
    }
    // Stops and prints elapsed time
    console.timeEnd(timeLabel);
  })
  .catch((error) => console.error(`Failed to copy some files: ${error}`));
