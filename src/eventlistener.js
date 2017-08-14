export class EventListener {

    constructor() {
        this.events = [];
    }

    on(names, handler) {
        if (typeof handler !== 'function')
            throw new Error('Second argument should be function');    
        
        names.split(' ').forEach(name => {
            this.events[name] = handler;
        });

        return this;
    }

    trigger(name, args) {
        var handler = this.events[name];
   
        if (typeof handler === 'function')
            return handler(args) !== false;
            
        return true;
    }
}