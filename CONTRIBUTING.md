# Contributing to oc-codegen

Hello! Thanks for your interest in contributing! Before implementing new features and changes please create an issue so we can have a discussion about it!

## ✨ Submitting a pull request

1. Fork this repository
2. Create a new branch with the name of the feature you plan to work on
3. Install dependencies using [yarn](https://yarnpkg.com/en/)
4. Make your changes.
5. Run `yarn build` to compile the typescript, run the tests, and generate the documentation.
6. Verify your changes work as expected. Run `npm install /path/to/this/folder` in a different project to install locally and test
7. Update the [changelog](./CHANGELOG.md)
8. Update the version in [package.json](../package.json). We adhere to [semantic versioning](https://semver.org/)
9. Commit your changes. We adhere to the [gitmoji](https://github.com/carloscuesta/gitmoji/) standard
10. Create a pull request
11. Have a beer! 🍻

## 🚀 Releasing

Assuming you or a contributor followed the instructions for [making a pull request](#✨-submitting-a-pull-request) and are a maintainer you can follow these instructions to release a new version of the sdk.

1. Run `yarn build` to compile the typescript, run the tests, and generate the documentation
2. Make sure the version in package.json adheres to [semantic versioning](https://semver.org/)
3. If any additional changes were made, commit them and make sure you adhere to the [gitmoji](https://github.com/carloscuesta/gitmoji/) standard
4. Publish on npm
   - for pre-releases run `npm publish --tag next`
   - for normal releases run `npm publish`
5. Create and publish a new release on github
6. Have a beer! 🍻
