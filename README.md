*Use of this software is subject to important terms and conditions as set forth in the License file*

# Iframe App Template

## Description
This repo contains a template to help developers build Iframe apps for Zendesk products.

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
npm install --global webpack
npm install --global foreman
```

Note: Foreman was originally created as a Ruby tool. If you prefer, you can install it by `gem install foreman` instead.

### Running locally

Foreman allows you to easily run multiple processes in one tab. One process is `zat server`, which serves the app in a way that can be consumed by the host (eg Zendesk). The second is `webpack --watch` to rebuild the project whenever you save changes to a source file.

To run these processes, run

```
nf start
```

or run the individual commands from the Procfile in separate terminals.

Note: if you installed the Ruby version of foreman, you'll need to use `foreman start`.

## Testing
WIP

## Contribute
* Put up a PR into the master branch.
* CC and get a +1 from @zendesk/vegemite.

## Bugs
Submit Issues via [GitHub](https://github.com/zendesk/iframe_app_template/issues/new) or email vegemite@zendesk.com.

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
