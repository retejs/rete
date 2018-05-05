import * as d3 from 'd3';

export class ViewUtils {

    static getInputPosition(input) {
        var node = input.node;
        var el = input.el;

        return [
            node.position[0] + el.offsetLeft + el.offsetWidth / 2,
            node.position[1] + el.offsetTop + el.offsetHeight / 2
        ]
    }

    static getOutputPosition(output) {
        var node = output.node;
        var el = output.el;

        return [
            node.position[0] + el.offsetLeft + el.offsetWidth / 2,
            node.position[1] + el.offsetTop + el.offsetHeight / 2
        ]
    }

    static getConnectionPath(a, b, produce, pathInfo) {
        var { points, curve } = produce(...a, ...b, pathInfo);

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
}
