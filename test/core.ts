import { Comp1 } from './data/components';
import { NodeEditor } from '../src';
import { Plugin } from '../src/core/plugin';
import assert from 'assert';

declare module '../src/events' {
    interface EventsTypes {
        'unit-test': void;
    }
}

const mockPlugin: Plugin = {
    name: 'test',
    install(editor: NodeEditor, { window = {} }) {
        editor.bind('unit-test');
        editor.on('unit-test', () => true)

        window._globalVar = 1; // addEventListener replacement
        editor.on('destroy', () => delete window._globalVar)
    }
};

describe('Core', () => {

    let editor: NodeEditor;

    beforeEach(() => {
        let container = document.createElement('div') as HTMLElement;

        editor = new NodeEditor('test@0.0.1', container);

        editor.events['warn'] = [];
        editor.events['error'] = [];
    })

    it('events', () => {
        assert.doesNotThrow(() => editor.trigger('nodecreate'), Error, 'nodecreate events exist');
        assert.throws(() => editor.on('wrngevent' as any, () => {}), Error, 'throw exception on non-exist event');
        assert.doesNotThrow(() => editor.on(['nodecreate'], () => {}), Error, 'on events array');
    })

    it('use plugin', () => {
        assert.doesNotThrow(() => editor.use(mockPlugin), 'use plugin first time');
        assert.throws(() => editor.use(mockPlugin), 'use plugin second time');
    });

    it('plugin event', () => {
        assert.throws(() => editor.trigger('unit-test'), 'event doesnt exist')
        editor.use(mockPlugin)
        assert.doesNotThrow(() => editor.trigger('unit-test'), 'event should exist')
    });

    it('register component', () => {
        let comp = new Comp1();

        assert.doesNotThrow(() => editor.register(comp), 'register first time');
        assert.throws(() => editor.register(comp), 'register second time');
    })

    it('destroy', () => {
        const window: any = {};

        editor.use(mockPlugin, { window })
        assert.strictEqual(window._globalVar, 1, 'global property assigned')

        editor.destroy();
        assert.strictEqual(typeof window._globalVar, 'undefined', 'global property deleted')

    });
});
