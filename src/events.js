export class Events {

    constructor() {
        this.nodeCreated = function (node) {};
        this.connectionCreated = function (connection) {};
        this.nodeSelected = function (node) {};
        this.connectionSelected = function (connection) {};
        this.nodeRemoved = function (node) {};
        this.connectionRemoved = function (connection) {};
    }
}