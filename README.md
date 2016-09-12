*Use of this software is subject to important terms and conditions as set forth in the License file*

# App Scaffold

## Description
This repo contains a scaffold to help developers build Iframe apps for Zendesk products.

## Owners
The project is maintained by the Quokka / Vegemite team, ping us with [@zendesk/vegemite on GitHub](https://github.com/orgs/zendesk/teams/vegemite).

## Getting Started

### Setup
1. Clone or fork this repo
2. Run `npm install`

To run your app locally in Zendesk, you need the [Zendesk Apps Tools (ZAT)](https://github.com/zendesk/zendesk_apps_tools).

You'll also need to run a couple of command-line Node.js-based tools that are installed using `npm`. For a node module to be available from the command-line, it must be installed globally.

To setup these and other dependencies, run these commands:

```
gem install zendesk_apps_tools
npm install --global webpack foreman karma-cli
```

Note: Foreman was originally created as a Ruby tool. If you prefer, you can install it by `gem install foreman` instead.

### Migrating from v1
The master branch of this repo contains modules and sample code to help you migrate from a v1 app. For detailed documentation on how to migrate from a v1 app see our [Migrating to v2](https://developer.zendesk.com/apps/docs/apps-v2/migrating) guide on the Zendesk Developer Portal.

### Starting from scratch
If you're starting a v2 app from scratch you will need to check out the [from-scratch](https://github.com/zendesk/app_scaffold/tree/from-scratch) branch:

```
git checkout from-scratch && npm install
```

The from-scratch branch uses up-to-date versions of the libraries included with the App Scaffold and also removes the shims needed when migrating from v1. It also includes sample code to help you get started on v2. If you want to see the exact differences between the master and from-scratch branches click [here](https://github.com/zendesk/app_scaffold/compare/from-scratch).

### Running locally

Foreman allows you to easily run multiple processes in one tab. One process is `zat server`, which serves the app in a way that can be consumed by the host (eg Zendesk). The second is `webpack --watch` to rebuild the project whenever you save changes to a source file.

To run these processes, run

```
nf start
```

or run the individual commands from the Procfile in separate terminals.

Note: if you installed the Ruby version of foreman, you'll need to use `foreman start`.

## Testing
The App Scaffold is currently setup for testing with [Jasmine](http://jasmine.github.io/) (testing framework) and [Karma](https://karma-runner.github.io) (test runner). To run specs, run

```
karma start
```

Specs live under the `spec` directory and can be configured by editing the `karma.conf.js` file.

## External Dependencies
External dependencies are defined in the  [`webpack.config.js`](https://github.com/zendesk/app_scaffold/blob/master/webpack.config.js) as `externalAssets`. This ensures these dependencies are included on your app's `index.html` as well as in the test suite.

## Contribute
* Put up a PR into the master branch.
* CC and get a +1 from @zendesk/vegemite.

## Bugs
Submit Issues via [GitHub](https://github.com/zendesk/app_scaffold/issues/new) or email vegemite@zendesk.com.

## Useful Links
Links to maintaining team, confluence pages, Datadog dashboard, Kibana logs, etc
- https://developer.zendesk.com/
- https://github.com/zendesk/zendesk_apps_tools
- https://webpack.github.io

## Copyright and license
Copyright 2016 Zendesk

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.

You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
