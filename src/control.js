export class Control {

    constructor(html, handler = () => { }) {
        this.html = html;
        this.parent = null;
        this.handler = handler;
    }

    toJSON() {
        return {
            'html': this.html
        }
    }

    static fromJSON(json) {
        var control = new Control(json.html);
        
        return control;
    }    
}