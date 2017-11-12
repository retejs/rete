import { Group, GroupHandler, GroupTitle } from './group';
import { PickInput, PickOutput } from './io';
import { Connection } from './connection';
import { Control } from './control';
import { Item } from './contextmenu';
import { Node } from './node';

export function declareViewDirectives(view, alight) {
    
    alight.directives.al.node = Node.bind(view);
    
    alight.directives.al.group = Group.bind(view);
    alight.directives.al.groupHandler = GroupHandler.bind(view);
    alight.directives.al.groupTitle = GroupTitle.bind(view);
    
    alight.directives.al.pickInput = PickInput.bind(view);
    alight.directives.al.pickOutput = PickOutput.bind(view);
        
    alight.directives.al.control = Control.bind(view);

    alight.directives.al.connection = Connection.bind(view);
}

export function declareMenuDirectives(menu, alight) {
    
    alight.directives.al.item = Item.bind(menu);
}