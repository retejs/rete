export function Connection(scope, el, expression, env) {
    var path = env.changeDetector.locals.path;
    var connection = path.connection;

    if (!connection) return;
    
    connection.el = el;
    env.watch('path.connection.style', () => {
        Object.assign(el.style, connection.style);
    }, { deep: true });

    el.dataset.inputNode = path.connection.input.node.id;
    el.dataset.inputIndex = path.connection.input.node.inputs.indexOf(path.connection.input);
    el.dataset.outputNode = path.connection.output.node.id;
    el.dataset.outputIndex = path.connection.output.node.outputs.indexOf(path.connection.output);
}