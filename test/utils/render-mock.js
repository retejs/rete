export function renderMock(editor) {
    editor.on('rendernode', ({ node, bindSocket, bindControl }) => {
        Array.from(node.inputs.values()).forEach(i => {
            bindSocket(document.createElement('div'), 'input', i);
        });
        Array.from(node.outputs.values()).forEach(o => {
            bindSocket(document.createElement('div'), 'output', o);
        });
    });
}