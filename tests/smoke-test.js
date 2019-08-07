const codegen = require('../lib/src/index');
const path = require('path');
const chalk = require('chalk');

/**
 * run by callin `yarn test`
 * validates that the spec can be formatted without errors
 * not a very comprehensive test, ideally should be tested by generating sdks
 */

//  supress noisy debug log, we only want to validate completion of task
const originalLogFn = console.log;
console.log = function() {};

codegen.default.generate({
    inputSpec: path.resolve(__dirname, 'openapi.json'),
    debug: true
})
.then(() => {
    console.log = originalLogFn;
    console.log(chalk.greenBright('Smoke Tests Passed! 🎉'));
})
.catch(error => {
    console.log = originalLogFn;
    console.log(chalk.redBright(`Smoke Tests Failed! 💩\nUnable to format spec\nMessage: ${error.message}\n\n`))
    console.log(chalk.redBright(error.stack))
    process.exit(1); // prevent execution of the next command
})