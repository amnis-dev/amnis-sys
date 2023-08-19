<div align="center">
  <img src="./res/amnis-sys-logo-256.webp" alt="Amnis Sys" width="100" height="100">
  <h1 align="center">AmnisSys</h1>
  <p align="center">An Open Source System for Managable Web and Mobile(WIP) Projects.</p>

  [![GitHub license](https://img.shields.io/github/license/amnis-dev/amnis-sys)](https://github.com/amnis-dev/amnis-sys/blob/main/LICENSE)
  [![Build Status](https://img.shields.io/github/actions/workflow/status/amnis-dev/amnis-sys/integrity-check.yml?label=Integrity%20Check)](https://github.com/amnis-dev/amnis-sys/actions)

</div>

## Introduction

AmnisSys is a library/framework (depending on how it's used) for developing full-stack web applications with tools that enable **_anyone_** to manage it. It takes care of syncronizing, caching, communications, and other governing behaviors within clients and services. It provides optimized components for displaying and configuring information.

AmnisSys contains a complete graphical user interface (GUI) management system called **Crystalizer MS**.

## Installation

AmnisSys can be installed using npm, yarn, or pnpm.

Important to note that this package is only capatible with modern NodeJS 16+ ESM projects.

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

These plugins are complete functional systems that extend the capabilities of AmnisSys. These plugin packages can be asynchronously imported, providing the enhancements when needed.

| package | latest | description |
| --- | --- | --- |
| `@amnis/web` | [![@amnis/web](https://img.shields.io/npm/v/@amnis/web)](https://www.npmjs.com/package/@amnis/web) | Includes the essential tools and components for implementing and managing web applications. This package is already included with `@amnis/sys/web`. |

## Dependencies

| Name | Package | License | Justification | `/` | `/web` | `/express` |
| --- | --- | --- | --- | --- | --- | --- |
| [Redux Toolkit](https://redux-toolkit.js.org/) | [`@reduxjs/toolkit`](https://github.com/reduxjs/redux-toolkit) | [MIT](https://github.com/reduxjs/redux-toolkit/blob/master/LICENSE) | Solid library to implement a predicable application state with efficient query managment. | &check; | &check; | &check; |
| [Cross-Fetch](https://github.com/lquixada/cross-fetch) | [`cross-fetch`](https://github.com/lquixada/cross-fetch) | [MIT](https://github.com/lquixada/cross-fetch/blob/v4.x/LICENSE) | Effective cross-platform polyfill functions and types for fetching data across a network. | &check; | &check; | &check; | 
| [Mock Service Worker](https://mswjs.io/) | [`msw`](https://github.com/mswjs/msw) | [MIT](https://github.com/mswjs/msw/blob/main/LICENSE.md) | Productive cross-platform API mocking for safe and offline application usage. | | &check; | | 
| [AJV Validator](https://ajv.js.org/) | [`ajv`](https://github.com/ajv-validator/ajv) | [MIT](https://github.com/ajv-validator/ajv/blob/master/LICENSE) | Highly performant JSON Schema validator for varifying data integrity. | | | &check; |