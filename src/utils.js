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
            bottom: bottom
        };
    }
}