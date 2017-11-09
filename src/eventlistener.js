export class EventListener {

    constructor() {
        this.events = {
            nodecreate:[],
            groupcreate: [],
            connectioncreate: [],
            noderemove:[],
            groupremove:[],
            connectionremove:[],
            nodeselect:[],
            groupselect:[],
            change: [],
            transform: []
        };
        this.persistent = true;
    }

    on(names: string, handler: () => {}) { 

        names.split(' ').forEach(name => {
            if (!this.events[name])
                throw new Error(`The event ${name} does not exist`); 
            this.events[name].push(handler);
        });
        
        return this;
    }

    trigger(name: string, param) {

        if (!(name in this.events))
            throw new Error(`The event ${name} cannot be triggered`);
        
        return this.events[name].reduce((r, e) => {
            return (e(param, this.persistent) !== false) && r
        }, true); // return false if at least one event is false        
    }
}