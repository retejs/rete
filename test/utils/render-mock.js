export function renderMock(editor) {
    editor.on('rendernode', ({ node, bindSocket, bindControl }) => {
        node.inputs.map(i => {
            bindSocket(document.createElement('div'), 'input', i);
        });
        node.outputs.map(o => {
            bindSocket(document.createElement('div'), 'output', o);
        });
    });
}