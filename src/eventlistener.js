export class EventListener {

    constructor() {
        this.events = [];
    }

    on(names: string, handler: () => {}) { 

        names.split(' ').forEach(name => {
            this.events[name] = handler;
        });
        
        return this;
    }

    trigger(name: string, args) {

        if (name in this.events)
            return this.events[name](args) !== false;
            
        return true;
    }
}