Note: Run commands in the root app directory.

Compile the app for DEV
===============
1) `npm run install`
3) `npm run watch`
4) `zat server -p dist` - Serves the app to your zendesk instance with `?zat=true`

Compile the app for PROD
===============
1) `npm run install --only=production`
3) `zat translate update -p src` - This will download the newest translations from Rosetta
4) `npm run build:prod`

To test other languages
===============
1) `npm run install --only=production`
3) `zat translate update -p src` - This will download the newest translations from Rosetta
4) `npm run watch`
5) `zat server -p dist`

To run the tests
===============
1) `npm run install`
2) `zat translate to_json -p src`
3) `npm run test`
