export class Events {

    constructor() {
        this.nodeCreated = function (node) {};
        this.connectionCreated = function (connection) { };
        this.groupCreated = function (group) { };
        this.nodeSelected = function (node) {};
        this.connectionSelected = function (connection) {};
        this.groupSelected = function (group) {};
        this.nodeRemoved = function (node) {};
        this.connectionRemoved = function (connection) {};
        this.groupRemoved = function (group) {};
    }
}