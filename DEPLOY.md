Note: Run commands in the root app directory.

Compile the app for DEV
===============
1) `yarn install`
2) `yarn run watch`
3) Open a new command line window in the root app directory
4) `zcli apps:server dist` - Serves the app to your Zendesk instance with `?zcli_apps=true`

Compile the app for PROD
===============
1) `yarn install`
2) `yarn run build`

To run the tests
===============
1) `yarn install`
2) `yarn test`
