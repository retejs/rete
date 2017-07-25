export class Control {

    constructor(html) {
        this.html = html;
        this.parent = null;
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