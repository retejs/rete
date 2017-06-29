export class Control {

    constructor(html, height = 0.02) {
        this.margin = 0.01;
        this.height = height;
        this.html = html;
        this.parent = null;
    }

    positionX() {
        return this.margin + this.parent.position[0];
    }

    positionY() {
        var prevControlsHeight = 0;
        var l = this.parent.controls.indexOf(this);

        for (var i = 0; i < l; i++)
            prevControlsHeight += this.parent.controls[i].height;

        return this.parent.headerHeight() +
                    + this.parent.outputsHeight()
                    + prevControlsHeight
                    + this.parent.position[1]; 
    }

    positionInputX() {
        return this.parent.positionX()
            + this.parent.socket.radius
            + this.parent.socket.margin
    }

    positionInputY() {
        return this.parent.positionY()
            - this.parent.socket.radius
            - this.parent.socket.margin;
    }

    toJSON() {
        return {
            'margin': this.margin,
            'height': this.height,
            'html': this.html
        }
    }

    static fromJSON(json) {
        var control = new Control(json.html);

        control.height = json.height;
        control.margin = json.margin;
        
        return control;
    }    
}