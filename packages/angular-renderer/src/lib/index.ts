import { Type } from '@angular/core';
import { NodeEditor } from '@naetverkjs/naetverk';
import { AngularControl, ElementProps, AngularComponentData } from './types';
import { NodeComponent } from './node/node.component';

function install(editor: NodeEditor, params : { component?: Type<any> } = {}) {
    editor.on('rendernode', ({ el, node, component, bindControl, bindSocket }) => {
        const ngComponent = component as unknown as AngularComponentData;

        if (ngComponent.render && ngComponent.render !== 'angular') return;

        const element = document.createElement('naetverk-element');
        const props: ElementProps = element as any;

        props.component = ngComponent.component || params.component || NodeComponent;
        props.props = Object.assign({}, ngComponent.props || {}, {
            node,
            editor,
            bindControl,
            bindSocket
        });

        el.appendChild(element);
    });

    editor.on('rendercontrol', ({ el, control }) => {
        const ngControl = control as unknown as AngularControl;

        if (ngControl.render && ngControl.render !== 'angular') return;

        const element = document.createElement('naetverk-element');
        const props: ElementProps = element as any;

        props.component = ngControl.component;
        props.props = ngControl.props;

        el.appendChild(element);
    });
    editor.on(['connectioncreated', 'connectionremoved'], connection => {
        connection.output.node.update();
        connection.input.node.update();
    });
    editor.on('nodeselected', () => {
        editor.nodes.forEach(n => n.update());
    });
}

export const AngularRenderPlugin = {
    name: 'angular-render',
    install
};

export * from './types';
export { NaetverkModule } from './module';
export { NodeService } from './node.service';
export { NodeComponent } from './node/node.component';
export { SocketComponent } from './socket/socket.component';
