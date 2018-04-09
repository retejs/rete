var p = (v) => parseInt(v);
var eqArr = (ar1, ar2) => ar1.every((v, i) => v === ar2[i]);
var eqObj = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);
var eqCon = (c1, c2, target) => {
    return c1.node === c2.node && c1[target] === c2[target];
}
var diffCons = (cons1, cons2) => {

    var removed = cons1.filter(c1 => !cons2.some(c2 => eqCon(c1, c2, 'input')));
    var added = cons2.filter(c2 => !cons1.some(c1 => eqCon(c1, c2, 'input')));
    
    return {removed, added}
}

export class Diff {

    constructor(data1, data2) {
        this.a = data1;
        this.b = data2;
    }

    basicDiffs() {
        var k1 = Object.keys(this.a.nodes);
        var k2 = Object.keys(this.b.nodes);

        var removed = k1.filter(k => !k2.includes(k)).map(p);
        var added = k2.filter(k => !k1.includes(k)).map(p);
        var stayed = k1.filter(k => k2.includes(k)).map(p);
        
        return { removed, added, stayed };
    }

    compare() {
        var { removed, added, stayed } = this.basicDiffs();

        var moved = stayed.filter(id => {
            var p1 = this.a.nodes[id].position;
            var p2 = this.b.nodes[id].position;

            return !eqArr(p1, p2)
        });

        var datachanged = stayed.filter(id => {
            var d1 = this.a.nodes[id].data;
            var d2 = this.b.nodes[id].data;

            return !eqObj(d1, d2);
        });

        var connects = stayed.reduce((arr, id) => {
            var o1 = this.a.nodes[id].outputs;
            var o2 = this.b.nodes[id].outputs;

            var output = o1.map((out, i) => {
                return Object.assign({output: i}, diffCons(out.connections, o2[i].connections))
            }).filter(diff => diff.added.length !== 0 || diff.removed.length !== 0);

            return [...arr, ...output.map(o => (o.node=id, o))];
        }, [])

        return {removed, added, moved, datachanged, connects}
    }
}