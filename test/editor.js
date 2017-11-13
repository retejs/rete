import * as D3NE from '../build/d3-node-editor';
import {JSDOM} from 'jsdom';
import assert from 'assert';
import throwsAsync from './utils/throwsAsync';

const { window } = new JSDOM('<!DOCTYPE html><head></head><body><div id="d3ne"></div></body>');
const { document } = window;

global.document = document;
global.window = window;
global.HTMLElement = window.HTMLElement;
global.d3 = require('d3');
global.alight = require('alight');

describe('Editor', () => {

    var c = document.querySelector('#d3ne');
    var menu = new D3NE.ContextMenu({});

    it('init', () => {
        assert.throws(() => new D3NE.NodeEditor('test@0.0.2', null, [], menu), Error, 'container');
        assert.throws(() => new D3NE.NodeEditor('test@0.0.2', c, {}, menu), Error, 'components');
        assert.throws(() => new D3NE.NodeEditor('test', c, [], menu), Error, 'id');
        assert.throws(() => new D3NE.NodeEditor('test@5.5', c, [], menu), Error, 'id');
        assert.throws(() => new D3NE.NodeEditor('test@0.1.2', c, [], {}), Error, 'menu');
    })

    it('import/export', async () => {
        var editor = new D3NE.NodeEditor('test@0.0.2', c, [], menu);

        await throwsAsync(async () =>
            await editor.fromJSON({ id: 'test@0.0.1', nodes: {}, groups: {} }),
            'can not be taken with another id');
        
        await throwsAsync(async () =>
            await editor.fromJSON({ id: 'test@0.0.2', nodes: null, groups: {} }),
            'nodes are mandatory');
    });
})