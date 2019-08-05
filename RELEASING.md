# Releases

The purpose of this document is to outline the steps required to generate a new release:

1. Update code in project
2. Run `npm run build`
3. Test code generation works as expected in one of the javascript SDKs by using [npm link](https://medium.com/@alexishevia/the-magic-behind-npm-link-d94dcb3a81af)
4. install `np` globally if you don't already have it ([doesn't work locally](https://github.com/sindresorhus/np/issues/190#issuecomment-370035957))
5. run `np --no-tests`
