export function Connection(scope, el, expression, env) {
    var path = env.changeDetector.locals.path;
    var connection = path.connection;

    if (!connection) return;
    
    connection.el = el;
    env.watch('path.connection.style', () => {
        Object.assign(el.style, connection.style);
    }, { deep: true });
    
    var input = path.connection.input;
    var output = path.connection.output;

    el.dataset.inputNode = input.node.id;
    el.dataset.inputIndex = input.node.inputs.indexOf(input);
    el.dataset.outputNode = output.node.id;
    el.dataset.outputIndex = output.node.outputs.indexOf(output);
    el.className.baseVal += ' output-'+output.socket.id.toLowerCase().replace(' ', '-');
    el.className.baseVal += ' input-'+input.socket.id.toLowerCase().replace(' ', '-');
}