const { resolve, dirname } = require('path');
const { isDirectorySync, isFileSync } = require('path-type');
const TemplateDirNotFound = require('../errors/TemplateDirNotFound');

/**
 * Returns absolute path for template directory if a relative path is provided,
 * checking if the absolute path exists
 * @param {string} templateDirectory Relative/absolute path
 * @param {string} basePath Absolute path if a relative path is provided
 */
module.exports = (templateDirPath, basePath) => {
  const templateDir = resolve(
    isFileSync(basePath) ? dirname(basePath) : basePath,
    templateDirPath
  );
  if (!templateDirPath || !isDirectorySync(templateDir)) {
    throw new TemplateDirNotFound();
  }

  return templateDir;
};
