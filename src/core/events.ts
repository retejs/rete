export class Events {

    constructor(public handlers: any) {
        this.handlers = {
            warn: [console.warn],
            error: [console.error],
            ...handlers
        };
    }    
}