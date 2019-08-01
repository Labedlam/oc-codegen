#!/usr/bin/env node

/* tslint:disable: no-console */
import path from 'path';
import program from 'commander';
import packageInfo from './package.json';
import codegen from './src/index';
import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import ora from 'ora';

// display banner
clear();
console.log(
  chalk.cyanBright(figlet.textSync('oc-codegen', { horizontalLayout: 'full' }))
);

const parsePath = dir => path.resolve(dir);
program
  .version(packageInfo.version, '-v, --version')
  .description('A codegen tool for the OrderCloud API')
  .option(
    /**
     * TODO: make input spec an optional parameter when
     * we have this deployed somewhere (default to prod api spec url)
     */
    '-i, --input-spec <path>',
    '(required) path to valid openapi spec v3.0.0+'
  )
  .option(
    '-t, --templates-folder <folder>',
    '(required) where to locate handlebars templates'
  )
  .option(
    '-o, --output-folder <folder>',
    'where to write the generated files (defaults to current directory)',
    parsePath,
    process.cwd()
  )
  .option(
    '-b, --handlebars-extensions <filepath>',
    'path to external handlebars extensions file (defaults to empty)',
    parsePath
  )
  .option('-d, --debug', 'prints formatted spec passed to handlebars')
  .parse(process.argv);

if (!program.inputSpec) {
  console.error(chalk.bold.red('> Path to Open API file not provided'));
  program.help(); // This exits the process
}

if (!program.templatesFolder && !program.debug) {
  console.error(
    chalk.bold.red('> Path to handlebars templates folder not provided')
  );
  program.help(); // This exits the process
}

const spinner = ora().start();
codegen
  .generate({
    inputSpec: program.inputSpec,
    outputFolder: program.outputFolder,
    templatesFolder: program.templatesFolder
      ? path.resolve(process.cwd(), program.templatesFolder)
      : undefined,
    handlebarsExtensions: program.handlebarsExtensions
      ? path.resolve(process.cwd(), program.handlebarsExtensions)
      : undefined,
    debug: program.debug,
  })
  .then(() => {
    spinner.stop();
    if (!program.debug) {
      console.log(chalk.greenBright('Done! ✨'));
      console.log(
        chalk.yellowBright('Check out your shiny new API at ') +
          chalk.magentaBright(program.outputFolder) +
          chalk.yellowBright('.')
      );
    }
  })
  .catch(err => {
    spinner.stop();
    console.error(chalk.redBright('Aaww 💩. Something went wrong:'));
    console.error(chalk.redBright(err.stack || err.message));
  });

process.on('unhandledRejection', err => console.error(err));
