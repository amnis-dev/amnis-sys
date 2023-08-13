<div align="center">
  <img src="./res/amnis-sys-logo-256.webp" alt="Amnis Sys" width="100" height="100">
  <h1 align="center">AmnisSys</h1>
  <p align="center">An Open Source System for Managable Web and Mobile(WIP) Projects.</p>

  [![GitHub license](https://img.shields.io/github/license/amnis-dev/amnis-sys)](https://github.com/amnis-dev/amnis-sys/blob/main/LICENSE)
  [![Build Status](https://img.shields.io/github/actions/workflow/status/amnis-dev/amnis-sys/integrity-check.yml?label=Integrity%20Check)](https://github.com/amnis-dev/amnis-sys/actions)

</div>

## Introduction

AmnisSys provides a solid foundation for developing full-stack web/mobile(WIP) applications that _anyone_ can manage. It greatly simplifies syncronizing, caching, and managing behaviors within clients and services.

AmnisSys includes a user interface (UI) manager called **Crystalizer MS**.

⚠ This project supports modern Node 16+ ESM only.

## Installation

AmnisSys can be installed using npm, yarn, or pnpm.

**NPM**
```sh
npm install @amnis/sys
```

**Yarn**
```sh
yarn add @amnis/sys
```

**PNPM**
```sh
pnpm add @amnis/sys
```

## Packages

### Plugins

These plugins are complete functional systems that extend the capabilities of AmnisSys. These plugin packages can be asynchronously imported, allowing the situational enhancements.

| package | latest | description |
| --- | --- | --- |
| `@amnis/web`{1} | [![@amnis/web](https://img.shields.io/npm/v/@amnis/web)](https://www.npmjs.com/package/@amnis/web) | System for web applications |

* {1} Imported with `@amnis/sys/react`

### Libraries

These libraries are included with `@amnis/sys` and are imported as needed. If necessary, these packages can be used individually to fine tune application configuration and behaviors. 

| package | latest | description |
| --- | --- | --- |
| `@amnis/state`*{1} | [![@amnis/state](https://img.shields.io/npm/v/@amnis/state)](https://www.npmjs.com/package/@amnis/state) | Core utilities and data definitions |
| `@amnis/api`*{1} | [![@amnis/api](https://img.shields.io/npm/v/@amnis/api)](https://www.npmjs.com/package/@amnis/api) | Service processes and query tools |
| `@amnis/mock`*{2} | [![@amnis/mock](https://img.shields.io/npm/v/@amnis/mock)](https://www.npmjs.com/package/@amnis/mock) | API mocking for offline use & development |
| `@amnis/express`{3} | [![@amnis/express](https://img.shields.io/npm/v/@amnis/express)](https://www.npmjs.com/package/@amnis/express) | ExpressJS configurations and routes |
| `@amnis/db-cosmos`{4} | [![@amnis/db-cosmos](https://img.shields.io/npm/v/@amnis/db-cosmos)](https://www.npmjs.com/package/@amnis/db-cosmos) | Database adapter for Azure CosmosDB |

* {1} Imported with `@amnis/sys` and `@amnis/sys/react`
* {2} Dynamically imported with `@amnis/sys` and `@amnis/sys/react` when `NODE_ENV` is set to `development`
* {3} Imported with `@amnis/sys/express`
* {4} Imported with `@amnis/sys/express` if configured to use the database `cosmos`

### Configurations

The following recommended project configurations for development with Amnis.

| package | latest | description |
| --- | --- | --- |
| `@amnis/eslint-config-node` | [![@amnis/eslint-config-node](https://img.shields.io/npm/v/@amnis/eslint-config-node)](https://www.npmjs.com/package/@amnis/eslint-config-node) | ESLint configurations for node projects |
| `@amnis/eslint-config-react` | [![@amnis/eslint-config-react](https://img.shields.io/npm/v/@amnis/eslint-config-react)](https://www.npmjs.com/package/@amnis/eslint-config-react) | ESLint configurations for react projects |
| `@amnis/tsconfig-node` | [![@amnis/tsconfig-node](https://img.shields.io/npm/v/@amnis/tsconfig-node)](https://www.npmjs.com/package/@amnis/tsconfig-node) | TypeScript configurations for node projects |
| `@amnis/tsconfig-react` | [![@amnis/tsconfig-react](https://img.shields.io/npm/v/@amnis/tsconfig-react)](https://www.npmjs.com/package/@amnis/tsconfig-react) | TypeScript configurations for react projects |