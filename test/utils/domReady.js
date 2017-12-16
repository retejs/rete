import * as D3NE from '../../build/d3-node-editor';
import {JSDOM} from 'jsdom';

const { window } = new JSDOM('<!DOCTYPE html><head></head><body><div id="d3ne"></div></body>');
const { document } = window;

global.document = document;
global.window = window;
global.HTMLElement = window.HTMLElement;
global.d3 = require('d3');
global.alight = require('alight');
global.D3NE = D3NE;