#!/usr/bin/env node

const { mkdirSync } = require('fs');
const { resolve, dirname } = require('path');
const { sync: rimraf } = require('rimraf');
const { isDirectorySync } = require('path-type');
const isRegex = require('is-regex');
const prettyMilliseconds = require('pretty-ms');
const program = require('../src/program');
const { loadConfig } = require('../src/util/config');
const parseArgs = require('../src/util/parse-args');
const generateProject = require('../src');

// Start measuring time
const startTime = Date.now();
program.parse(process.argv);
console.info(`${program.name()} v${program.version()}`);

// Load config and validate contents
const { config, filepath: configPath } = loadConfig();
if (!config.templateFolder || !isDirectorySync(config.templateFolder)) {
  console.error(`Template folder specified in ${configPath} not found!`);
  process.exit(1);
}

// If templateName is not present, show help and exit
if (program.args.length < 1) {
  console.info(program.help());
}

// Validate destination
if (!isDirectorySync(program.destination)) {
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
if (!isDirectorySync(templatePath)) {
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
console.info('Genearing project from template...');
generateProject(
  templatePath,
  program.destination,
  placeholders,
  placeholderRegex,
  config.gitOptions,
  program.force
).then(() =>
  console.info(`Done in ${prettyMilliseconds(Date.now() - startTime)}.`)
);
