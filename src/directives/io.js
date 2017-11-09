export function PickInput(scope, el, expression, env) {
    var input = env.changeDetector.locals.input;

    input.el = el;

    d3.select(el).on('mousedown', () => {
        if (this.editor.readOnly) return;

        d3.event.preventDefault();
        if (this.pickedOutput === null) {
            if (input.hasConnection()) {
                this.pickedOutput = input.connections[0].output;
                this.editor.removeConnection(input.connections[0]);
            }
            this.update();
            return;
        }

        if (!input.multipleConnections && input.hasConnection())
            this.editor.removeConnection(input.connections[0]);
        else if (this.pickedOutput.connectedTo(input)) {
            var connections = input.connections.filter(c => c.output === this.pickedOutput);

            this.editor.removeConnection(connections[0]);
        }

        this.editor.connect(this.pickedOutput, input);

        this.pickedOutput = null;
        this.update();
    });
}

export function PickOutput(scope, el, expression, env) {
    var output = env.changeDetector.locals.output;

    output.el = el;

    d3.select(el).on('mousedown', () => {
        if (this.editor.readOnly) return;

        this.pickedOutput = output;
    });
}