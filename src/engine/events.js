import { Events } from '../core/events';

export class EngineEvents extends Events {

    constructor() {
        super({
            componentregister: []
        });
    }    
}