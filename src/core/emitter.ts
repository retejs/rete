import { Events } from './events';

export class Emitter {

    events: any = {};
    silent = false;

    constructor(events: Events | Emitter) {
        this.events = events instanceof Emitter ? events.events : events.handlers;
    }

    on(names: string, handler: (...args: any) => any) {
        names.split(' ').forEach(name => {
            if (!this.events[name])
                throw new Error(`The event ${name} does not exist`);
            this.events[name].push(handler);
        });

        return this;
    }

    trigger(name: string, params: any = {}) {
        if (!(name in this.events))
            throw new Error(`The event ${name} cannot be triggered`);

        return this.events[name].reduce((r: boolean, e: Function) => {
            return (e(params) !== false) && r
        }, true); // return false if at least one event is false        
    }

    bind(name: string) {
        if (this.events[name])
            throw new Error(`The event ${name} is already bound`);

        this.events[name] = [];
    }

    exist(name: string) {
        return Array.isArray(this.events[name]);
    }
}