const { resolve, dirname } = require('path');
const { isDirectorySync } = require('path-type');

/**
 * Returns absolute path for template directory if a relative path is provided,
 * checking if the absolute path exists
 * @param {string} templateDirectory Relative/absolute path
 * @param {string} basePath Absolute path if a relative path is provided
 */
module.exports = (templateDirPath, basePath) => {
  const templateDir = resolve(dirname(basePath), templateDirPath);
  if (!templateDirPath || !isDirectorySync(templateDir)) {
    return null;
  }

  return templateDir;
};
