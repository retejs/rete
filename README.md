# Naetverk.js

--- 
[![Build Status](https://travis-ci.org/naetverkjs/naetverk.svg?branch=master)](https://travis-ci.org/naetverkjs/naetverk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=naetverkjs_naetverk&metric=alert_status)](https://sonarcloud.io/dashboard?id=naetverkjs_naetverk)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=naetverkjs_naetverk&metric=coverage)](https://sonarcloud.io/dashboard?id=naetverkjs_naetverk)
---

#### JavaScript framework for visual programming

## Introduction

**Naetverk** is a modular framework for visual programming. **Naetverk** is heavily based on the fantastic [rete.js](https://github.com/retejs/rete) framework,
that allows you to create node-based editor directly in the browser.

**Why a different branch?** -  I have some ideas that I follow which are in conflict with the original implementation.

| Name                          | Description                                                                                                  | Extends              | Readme / Docs        |
|-------------------------------|--------------------------------------------------------------------------------------------------------------|----------------------|----------------------|
| @naetverkjs/naetverk          | Base library that allows the creation of node-based editors for visually programming or sequential scripting | -                    | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/naetverk/README.md)          |
| @naetverkjs/connections       | Plugin to render the connections between nodes                                                               | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/area-plugin/README.md)       |
| @naetverkjs/area              | Plugin to draw the network on a configurable background with limited zoom and grid snapping                  | @naetverkjs/naetverk | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/connection-plugin/README.md) |
|                               |                                                                                                              |                      |                                                                                                   |
| **Angular**                   |                                                                                                              |                      |                                                                                                   |
| @naetverkjs/angular-renderer  | Angular to Render basic nodes                                                                                |                      | [Readme](https://github.com/naetverkjs/naetverk/blob/master/packages/angular-renderer/README.md)  |                     |
 
