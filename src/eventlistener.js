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
            change:[]
        };
    }

    on(names: string, handler: () => {}) { 

        names.split(' ').forEach(name => {
            if (!this.events[name])
                throw new Error(`The event ${name} does not exist`); 
            this.events[name].push(handler);
        });
        
        return this;
    }

    trigger(name: string, args) {

        if (!(name in this.events))
            throw new Error(`The event ${name} cannot be triggered`);
        
        return this.events[name].reduce((r, e) => {
            return (e(args) !== false) && r
        }, true); // return false if at least one event is false        
    }
}