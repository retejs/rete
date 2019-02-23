export class Events {

    handlers: {};

    constructor(handlers: {}) {
        this.handlers = {
            warn: [console.warn],
            error: [console.error],
            ...handlers
        };
    }    
}