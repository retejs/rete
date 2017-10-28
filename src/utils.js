export class Utils {

    static nodesBBox(nodes) {
        var min = (arr) => Math.min(...arr);
        var max = (arr) => Math.min(...arr);

        var left = min(nodes.map(node => node.position[0]));
        var top = min(nodes.map(node => node.position[1]));
        var right = max(nodes.map(node => node.position[0] + node.width));
        var bottom = max(nodes.map(node => node.position[1] + node.height));
        
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

    static getConnectionPath(a, b, produce) {
        var { points, curve } = produce(...a, ...b);

        switch (curve) {
        case 'linear': curve = d3.curveLinear; break;
        case 'step': curve = d3.curveStep; break;
        case 'basis': curve = d3.curveBasis; break;
        default: curve = d3.curveBasis; break;
        }
        return this.pointsToPath(points, curve);
    }

    static pointsToPath(points, d3curve) {
        var curve = d3curve(d3.path());
        
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

    static getInputPosition(input) {
        var node = input.node;
        var el = input.el;

        return [
            node.position[0] + el.offsetLeft + el.offsetWidth / 2,
            node.position[1] + el.offsetTop + el.offsetHeight / 2
        ]
    }

    static isValidData(data) {
        return typeof data.id === 'string' &&
            typeof data.nodes === 'object' &&
            (!data.groups || typeof data.groups ==='object')
    }

    static isValidId(id) {
        return /^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$/.test(id);
    }

    static validate(id, data) {
        var msg = '';
        var id1 = id.split('@');
        var id2 = data.id.split('@');

        if (!this.isValidData(data))
            msg += 'Data is not suitable. '; 
        if (id !== data.id)
            msg += 'IDs not equal. ';
        if (id1[0] !== id2[0])
            msg += 'Names don\'t match. ';
        if (id1[1] !== id2[1])
            msg += 'Versions don\'t match';

        return { success: msg ==='', msg };
    }
}