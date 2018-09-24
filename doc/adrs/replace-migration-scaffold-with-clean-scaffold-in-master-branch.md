---
title: "ADR: Replace migration Scaffold with clean Scaffold in Master Branch"
date: 2018-08-16
draft: false
status: "Accepted"
---

# ADR: Replace migration Scaffold with clean Scaffold in Master Branch

## Context
At the moment, the master branch has the scaffold specifically built to help developers migrate v1 apps to v2. From monitor, the majority usage comes from [App Migrator](https://github.com/zendesk/zendesk_app_migrator) and [ZAT](https://github.com/zendesk/zendesk_apps_tools) which use the master branch as the download source.
It is more helpful to show developers coming directly to this repo a clean (from scratch) scaffold, one usable as a starting point to build new apps respecting our current conventions out of the box.

## Decision

### New app scaffold
A new *clean* app scaffold has been built on branch [offapps-migration](https://github.com/zendesk/app_scaffold/tree/offapps-migration) based on branch [from-scratch](https://github.com/zendesk/app_scaffold/tree/from-scratch)

### Move migration scaffold into App Migrator repository
Migration scaffold in master branch will be moved into [App Migrator](https://github.com/zendesk/zendesk_app_migrator), used and maintained as a *built-in* template resource

### Move new app scaffold to master branch

### Add support in [ZAT](https://github.com/zendesk/zendesk_apps_tools) to create new app with the new scaffold
* New command option `zat new --scaffold` will create a v2 app using the new app scaffold.

## Status

Accepted

## Consequences

* Auto migration from v1 to v2 are completely handled by [App Migrator](https://github.com/zendesk/zendesk_app_migrator), no external resource required, maintenance of the scaffold template should be done in App Migrator repo
* This repo is focusing on building/maintaining v2 app scaffolds for both external and internal use