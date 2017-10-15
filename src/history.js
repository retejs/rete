class Command {
    constructor(exec, undo, args) {
        this.exec = () => { exec(...args) };
        this.undo = () => { undo(...args) };
        this.a = args[0];
    }
}

export class History {

    constructor(editor) {
        this.editor = editor;
        this.list = [];
        this._locked = false;
        this.position = -1;
    }

    add(exec, undo, args) {
        if (this._locked) return;
        
        this.position++;
        this.list.splice(this.position);
        this.list.push(new Command(exec, undo, args));
    }

    undo() {
        if (this.position < 0) return;

        this._locked = true;
        this.list[this.position--].undo();
        this._locked = false;
    }

    redo() {
        if (this.position + 1 >= this.list.length) return;
        
        this._locked = true;
        this.list[++this.position].exec();
        this._locked = false;
    }
}