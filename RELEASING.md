# Releases

The purpose of this document is to outline the steps required to generate a new release:

1. Update code in project
2. Run `npm run build`
3. Test code generation works as expected in one of the javascript SDKs by using [npm link](https://medium.com/@alexishevia/the-magic-behind-npm-link-d94dcb3a81af)
4. Make sure the version in package.json is what you want the published version to be (adhere to semantic versioning)
5. Publish via npm
   - for pre-releases run `npm publish --tag next`
   - for normal releases run `npm publish`
6. Create and publish a new release on github
