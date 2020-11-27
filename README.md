# boilerplator

A CLI tool to dynamically generate projects from user-defined templates.

[![npm](https://img.shields.io/npm/v/boilerplator)](https://www.npmjs.com/package/boilerplator)
![npm](https://img.shields.io/npm/dt/boilerplator)
[![Build Status](https://travis-ci.com/DaCurse/boilerplator.svg?branch=master)](https://travis-ci.com/DaCurse/boilerplator)
[![Coverage Status](https://coveralls.io/repos/github/DaCurse/boilerplator/badge.svg?branch=master)](https://coveralls.io/github/DaCurse/boilerplator?branch=master)

- [boilerplator](#boilerplator)
    - [Installation](#installation)
    - [Setup](#setup)
    - [Config](#config)
    - [Creating templates](#creating-templates)
      - [Placeholders](#placeholders)
    - [Generating templates](#generating-templates)
  - [Command reference](#command-reference)
    - [init](#init)
      - [Default config locations](#default-config-locations)
    - [generate](#generate)
    - [list](#list)
    - [config](#config-1)
  - [Motivation](#motivation)
  - [Contribution](#contribution)
  - [License](#license)

### Installation

Install boilerplator globally:

```sh
# With npm
$ npm i -g boilerplator
# With yarn
$ yarn global add boilerplator
```

The `boil` command will be now available globally.

### Setup

To set up boilerplator, you will need a config file and a template directory. You can run `boil init` to create a config file with default options:

```sh
$ boil i --template-dir /path/to/template-directory
```

This will create a `config.json` file in a default location, based on your operating system.
For more information, refer to the [command reference](#init).

### Config

The config must be named `config` and can be a `.json`, `.js` or `.cjs` file that exports an object.

| Property                      | Type                  | Default            | Description                                                                                                    |
| ----------------------------- | --------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `templateDirectory`           | `string`              | -                  | Required option. Path to your template directory. A relative path would be relative to the config file's path. |
| `placeholderRegex`            | `string \| RegExp`    | `/{{([\w-_]+)}}/g` | Regular expression to match placeholders. Must have at least one capture group.                                |
| `defaultPlaceholders`         | `object`              | `{}`               | Key-value pairs of default placeholder names and their values.                                                 |
| `gitOptions.createRepository` | `boolean`             | `false`            | Whether to initialize an empty Git repository.                                                                 |
| `gitOptions.initialCommit`    | `string \| undefined` | `undefined`        | If not falsy, an initial commit would be made to the repository with the value as the message.                 |

### Creating templates

Templates are sub-directories within your template directory. The directory name is the template's name and all the files within it would be copied to the destination when generating a project from it.

#### Placeholders

You can put placeholders in directory/file names and file contents, and replace them with values when generating a template from them. Placeholders with the default regex will look like this: `{{placeholder-name}}`.

### Generating templates

Once you've created a config file and created some templates in your template directory, you can generate a template using the generate command.

For example, for the following template directory structure:

```
templates/
`-- react-component
    |-- index.js
    |-- {{component-name}}.module.css
    `-- {{component-name}}.spec.js

```

We can generate the `react-component` template, and provide a value for the `component-name` placeholder like so:

```sh
$ boil g -t react-component -d ./src/components/MyComp component-name=MyComp
```

Our `src/` directory after generating would look like this:

```
src/
`-- components
    `-- MyComp
        |-- MyComp.module.css
        |-- MyComp.spec.js
        `-- index.js

```

For more info, refer to the [command reference](#generate).

## Command reference

```
Usage: boil [options] [command]

Quickly and dynamically generates projects from pre-defined templates.

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  init|i          creates default config file
  generate|g      generates a project from a template
  list            lists all templates in template directory
  config          view or change the config
  help [command]  display help for command
```

### init

Creates default config file with specified template directory in the default location (based on OS).

```
Usage: boil-init --template-dir <path> [options]

Options:
  -t, --template-dir <path>  template directory path
  -d, --destination <path>   custom destination for the config file
  -f, --force                overwrite existing config
  -s, --spaces <number>      indentation size (default: 2)
  -h, --help                 display help for command
```

#### Default config locations

| Platform        | Path                                                            |
| --------------- | --------------------------------------------------------------- |
| Windows / win32 | `%APPDATA%\boilerplator`                                        |
| Linux           | `$XDG_CONFIG_HOME/boilerplator` or `$HOME/.config/boilerplator` |
| macOS / darwin  | `$HOME/Library/Application Support/boilerplator`                |

**Examples:**

Generating default config with template directory set to `~/templates` and a custom config file location.

```sh
$ boil init --template-dir ~/templates -d ~/custom-config-location
```

```
boil init v0.4.0
Creating default config file...
Created config file at ~/custom-config-location/config.json
{
  templateDirectory: '~/templates',
  placeholderRegex: '{{([\\w-_]+)}}',
  defaultPlaceholders: {},
  gitOptions: { createRepository: false }
}
```

### generate

Generates a project from a template in the configured template directory to a destination.

```
Usage: boil-generate -t <template name> -d <destination> [options] [placeholder1=...,]

Options:
  -t, --template <template name>  template name
  -d, --destination <path>        destination directory
  -f, --force                     overwrite existing directory
  -h, --help                      display help for command
```

**Examples:**

Generating the `test` template and providing placeholder values:

```
templates/test
|-- {{project-name}}
`-- {{test}}
```

```sh
$ boil g -t test -d ./dest project-name=testing test=123
```

```
boil generate v0.4.0
Finding template 'test'...
Parsing placeholders...
Generating project from template...
dest
├── 123
└── testing
Done in 44ms.
```

### list

Lists all templates in the configured template directory.

```
Usage: boil-list [options]

Options:
  -h, --help  display help for command
```

**Examples:**

Listing all templates.

```sh
$ boil list
```

```
boil list v0.4.0
Found 2 templates in ~/templates:
- react-typescript-template
- test
```

### config

Prints the current config and it's location. You can also change the location of the config file using with this command.

```
Usage: boil-config [options]

Options:
-d, --directory [path] set custom directory for the config file or reset it to default if no value is provided
-h, --help display help for command
```

**Examples:**

Printing out the current config.

```sh
$ boil config
```

```
boil config v0.4.0
Config file from ~/custom-config-location/config.json:
{
  placeholderRegex: '{{([\\w-_]+)}}',
  defaultPlaceholders: {},
  gitOptions: { createRepository: false },
  templateDirectory: '~/templates'
}
```

Changing config location.

```sh
$ boil config -d ~/custom-location
```

```
boil config v0.4.0
Setting config directory to ~/custom-location.
```

Resetting config location to OS default.

```sh
$ boil config -d
```

```
boil config v0.4.0
Resetting config directory to system default.
```

## Motivation

After looking for a tool to easily generate projects from templates I create, I haven't found anything that would be simple enough and satisfy my needs, so I decided to write a script to do so. Later, I decided to turn it into a larger maintainable project and publish it, mostly for practice.

## Contribution

Feel free to [submit issues](https://github.com/DaCurse/boilerplator/issues) to report bugs/suggest features and open [pull requests](https://github.com/DaCurse/boilerplator/pulls).

## License

This project is licensed under the [GNU General Public License v3.0](https://github.com/DaCurse/boilerplator/blob/master/LICENSE).
