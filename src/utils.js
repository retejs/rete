export class Utils {

    static nodesBBox(nodes) {
        var left = Math.min(...nodes.map(node => node.position[0]));
        var top = Math.min(...nodes.map(node => node.position[1]));
        var right = Math.max(...nodes.map(node => node.position[0] + node.width));
        var bottom = Math.max(...nodes.map(node => node.position[1] + node.height));
        
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
            getCenter: function () {
                return [
                    (left + right) / 2,
                    (top + bottom) / 2
                ];
            }
        };
    }

    static isValidJSON(data) {
        return typeof data.id === 'string' &&
            typeof data.nodes === 'object' &&
            typeof data.groups ==='object'
    }

    static isValidId(id) {
        return /^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$/.test(id);
    }

    static isCompatibleIDs(id1, id2) {
        id1 = id1.split('@');
        id2 = id2.split('@');

        if (id1[0] !== id2[0]) {
            console.error('Names don\'t match');
            return false
        }
        if (id1[1] !== id2[1]) {
            console.error('Versions don\'t match');
            return false
        }
        return true;
    }
}