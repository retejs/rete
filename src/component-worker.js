export class ComponentWorker {
    constructor(name, props) {
        this.name = name;
        this.worker = props.worker;
        this.created = props.created || function () { }
        this.destroyed = props.destroyed || function () { }
    }
}