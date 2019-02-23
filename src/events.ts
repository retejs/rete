import { Events } from './core/events';

export class EditorEvents extends Events {

    constructor() {
        super({
            nodecreate: [],
            nodecreated: [],
            noderemove: [],
            noderemoved: [],
            connectioncreate: [],
            connectioncreated: [],
            connectionremove: [],
            connectionremoved: [],
            translatenode: [],
            nodetranslate: [],
            nodetranslated: [],
            nodedraged: [],
            selectnode: [],
            nodeselect: [],
            nodeselected: [],
            rendernode: [],
            rendersocket: [],
            rendercontrol: [],
            renderconnection: [],
            updateconnection: [],
            componentregister: [],
            keydown: [],
            keyup: [],
            translate: [],
            translated: [],
            zoom: [],
            zoomed: [],
            click: [],
            mousemove: [],
            contextmenu: [],
            import: [],
            export: [],
            process: []
        });
    }    
}