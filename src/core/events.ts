import { Component } from '../engine/component';

export class Events {

    handlers: {};

    constructor(handlers: {}) {
        this.handlers = {
            warn: [console.warn],
            error: [console.error],
            componentregister: [],
            destroy: [],
            ...handlers
        }
    }
}

export interface EventsTypes {
    warn: string | Error;
    error: string | Error;
    componentregister: Component;
    destroy: void;
}