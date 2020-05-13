import { Component } from './component';
import { Connection } from './connection';
import { Control } from './control';
import { Data } from './core/data';
import { EditorView } from './view';
import { Input } from './input';
import { Node } from './node';
import { Output } from './output';
import { Socket } from './socket';
import { EventsTypes as DefaultEventsTypes, Events } from './core/events';
import { Mouse, Transform, ZoomSource } from './view/area';

export class EditorEvents extends Events {

    constructor() {
        super({
            nodecreate: [],
            nodecreated: [],
            noderemove: [],
            noderemoved: [],
            connectioncreate: [],
            connectioncreated: [],
            connectionremove: [],
            connectionremoved: [],
            translatenode: [],
            nodetranslate: [],
            nodetranslated: [],
            nodedraged: [],
            nodedragged: [],
            selectnode: [],
            multiselectnode: [],
            nodeselect: [],
            nodeselected: [],
            rendernode: [],
            rendersocket: [],
            rendercontrol: [],
            renderconnection: [],
            updateconnection: [],
            keydown: [],
            keyup: [],
            translate: [],
            translated: [],
            zoom: [],
            zoomed: [],
            click: [],
            mousemove: [],
            contextmenu: [],
            import: [],
            export: [],
            process: [],
            clear: []
        });
    }    
}

export interface EventsTypes extends DefaultEventsTypes {
    componentregister: Component;
    nodecreate: Node;
    nodecreated: Node;
    noderemove: Node;
    noderemoved: Node;
    connectioncreate: { input: Input; output: Output };
    connectioncreated: Connection;
    connectionremove: Connection;
    connectionremoved: Connection;
    translatenode: { node: Node; dx: number; dy: number };
    nodetranslate: { node: Node; x: number; y: number };
    nodetranslated: { node: Node; prev: [number, number] };
    nodedraged: Node;
    nodedragged: Node;
    selectnode: {
        node: Node;
        accumulate: boolean;
    };
    multiselectnode: {
        node: Node;
        accumulate: boolean;
        e: MouseEvent;
    };
    nodeselect: Node;
    nodeselected: Node;
    rendernode: {
        el: HTMLElement;
        node: Node;
        component: object;
        bindSocket: Function;
        bindControl: Function;
    };
    rendersocket: {
        el: HTMLElement;
        input?: Input;
        output?: Output;
        socket: Socket;
    };
    rendercontrol: {
        el: HTMLElement;
        control: Control;
    };
    renderconnection: {
        el: HTMLElement;
        connection: Connection;
        points: number[];
    };
    updateconnection: {
        el: HTMLElement;
        connection: Connection;
        points: number[];
    };
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
    translate: {
        transform: Transform;
        x: number;
        y: number;
    };
    translated: void;
    zoom: {
        transform: Transform;
        zoom: number;
        source: ZoomSource;
    };
    zoomed: {
        source: ZoomSource;
    };
    click: {
        e: Event;
        container: HTMLElement;
    };
    mousemove: Mouse;
    contextmenu: {
        e: MouseEvent;
        view?: EditorView;
        node?: Node;
    };
    import: Data;
    export: Data;
    process: void;
    clear: void;
}
