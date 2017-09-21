export class Utils {

    static nodesBBox(nodes) {
        var left = Math.min(...nodes.map(node => node.position[0]));
        var top = Math.min(...nodes.map(node => node.position[1]));
        var right = Math.max(...nodes.map(node => node.position[0] + node.width));
        var bottom = Math.max(...nodes.map(node => node.position[1] + node.height));
        
        return {
            left,
            right,
            top,
            bottom,
            getCenter: () => {
                return [
                    (left + right) / 2,
                    (top + bottom) / 2
                ];
            }
        };
    }

    static getConnectionPath(x1, y1, x2, y2) {
        var offsetX = 0.3 * Math.abs(x1 - x2);
        var offsetY = 0.1 * (y2 - y1);

        var p1 = [x1, y1];
        var p2 = [x1 + offsetX, y1 + offsetY];
        var p3 = [x2 - offsetX, y2 - offsetY];
        var p4 = [x2, y2];

        var points = [p1, p2, p3, p4];
        var curve = d3.curveBasis(d3.path());

        curve.lineStart();
        for (var i = 0; i < points.length;i++)
            curve.point(...points[i]);
        curve.lineEnd();
        return curve._context.toString();
    }

    static getOutputPosition(output) {
        var node = output.node;
        var el = output.el;

        return [
            node.position[0] + el.offsetLeft + el.offsetWidth / 2,
            node.position[1] + el.offsetTop + el.offsetHeight / 2
        ]
    }

    static geInputPosition(input) {
        var node = input.node;
        var el = input.el;

        return [
            node.position[0] + el.offsetLeft + el.offsetWidth / 2,
            node.position[1] + el.offsetTop + el.offsetHeight / 2
        ]
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