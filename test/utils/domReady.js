import { JSDOM } from 'jsdom';
const { window } = new JSDOM('<!DOCTYPE html><head></head><body><div id="Rete"></div></body>');
const { document } = window;

global.document = document;
global.window = window;
global.HTMLElement = window.HTMLElement;

console.error = function () {};
console.warn = function () {};
global.Rete = require('../../build/rete.min');