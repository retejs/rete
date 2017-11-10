import { Group, GroupHandler, GroupTitle } from './group';
import { PickInput, PickOutput } from './io';
import { Control } from './control';
import { Item } from './contextmenu';
import { Node } from './node';

export function declareViewDirectives(view, scope) {

    scope.nodeDir = Node.bind(view);

    scope.groupDir = Group.bind(view);
    scope.groupHandler = GroupHandler.bind(view);
    scope.groupTitle = GroupTitle.bind(view);

    scope.pickInput = PickInput.bind(view);
    scope.pickOutput = PickOutput.bind(view);
    
    scope.controlDir = Control.bind(view);
}

export function declareMenuDirectives(menu, scope) {
    
    scope.itemDir = Item.bind(menu);
}