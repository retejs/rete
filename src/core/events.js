export class Events {

    constructor(handlers) {
        this.handlers = {
            warn: [console.warn],
            error: [console.error],
            ...handlers
        };
    }    
}