const { program } = require('commander');
const { name, version, description } = require('../package.json');

// Configuring commander
program
  .name(name)
  .version(version)
  .description(description)
  .usage('templateName -d <destination> [options] [placeholder1=...,]')
  .requiredOption('-d, --destination <path>', 'destination directory')
  .option('-f, --force', 'overwrite existing directory')
  .option(
    '-c, --config <path>',
    'custom config file or directory to look for a config file'
  );

module.exports = program;
