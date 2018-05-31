import {JSDOM} from 'jsdom';
const { window } = new JSDOM('<!DOCTYPE html><head></head><body><div id="d3ne"></div></body>');
const { document } = window;

global.document = document;
global.window = window;
global.HTMLElement = window.HTMLElement;

global.D3NE = require('../../build/rete');