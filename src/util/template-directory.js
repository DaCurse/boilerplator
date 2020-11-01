const { resolve, dirname } = require('path');
const { isDirectorySync } = require('path-type');

/**
 * Returns absolute path for template directory if a relative path is provided,
 * checking if the absolute path exists
 * @param {string} templateDirectory Relative/absolute path
 * @param {string} basePath Absolute path if a relative path is provided
 */
module.exports = (templateDirectory, basePath) => {
  const templateDirectoryPath = resolve(dirname(basePath), templateDirectory);
  if (!templateDirectory || !isDirectorySync(templateDirectoryPath)) {
    return null;
  }

  return templateDirectoryPath;
};
