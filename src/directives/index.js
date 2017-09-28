import { Control } from './control';
import { Group, GroupHandler, GroupTitle } from './group';
import { PickInput, PickOutput } from './io';
import { Node } from './node';

export function declareDirectives(view) {

    alight.directives.al.node = Node.bind(view);

    alight.directives.al.group = Group.bind(view);
    alight.directives.al.groupHandler = GroupHandler.bind(view);
    alight.directives.al.groupTitle = GroupTitle.bind(view);

    alight.directives.al.pickInput = PickInput.bind(view);
    alight.directives.al.pickOutput = PickOutput.bind(view);
    
    alight.directives.al.control = Control.bind(view);
    
}