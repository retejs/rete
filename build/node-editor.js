(function (exports) {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Connection = function () {
    function Connection(output, input) {
        classCallCheck(this, Connection);

        this.output = output;
        this.input = input;

        this.input.setConnection(this);
    }

    createClass(Connection, [{
        key: "remove",
        value: function remove() {
            this.input.setConnection(null);
            this.output.removeConnection(this, false);
        }
    }]);
    return Connection;
}();

var ContextMenu = function () {
    function ContextMenu(items, onselect) {
        var _this = this;

        classCallCheck(this, ContextMenu);

        this.visible = false;
        this.menu = d3.select('body').append('div').classed('context-menu', true).style('display', 'none');

        this.item = this.menu.selectAll('div.item').data(items).enter().append('div').classed('item', true).text(function (d) {
            return d;
        }).on('click', function (d) {
            onselect(d);
            _this.hide();
        });
    }

    createClass(ContextMenu, [{
        key: 'isVisible',
        value: function isVisible() {
            return this.visible;
        }
    }, {
        key: 'show',
        value: function show(x, y) {
            this.visible = true;
            this.menu.style('left', x + 'px').style('top', y + 'px').style('display', 'block');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.visible = false;
            this.menu.style('display', 'none');
        }
    }]);
    return ContextMenu;
}();

var Control = /// TODO

function Control(html) {
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.02;
    classCallCheck(this, Control);

    this.margin = 0.01;
    this.height = height;
    this.html = html;
    this.parent = null;
};

var Events = function Events() {
    classCallCheck(this, Events);

    this.nodeCreated = function (node) {};
    this.connectionCreated = function (connection) {};
    this.nodeSelected = function (node) {};
    this.connectionSelected = function (connection) {};
    this.nodeRemoved = function (node) {};
    this.connectionRemoved = function (connection) {};
};

var Input = function () {
    function Input(title, socket) {
        classCallCheck(this, Input);

        this.node = null;
        this.connection = null;
        this.title = title;
        this.socket = socket;
        this.control = null;
    }

    createClass(Input, [{
        key: "hasConnection",
        value: function hasConnection() {
            return this.connection !== null;
        }
    }, {
        key: "setConnection",
        value: function setConnection(c) {
            this.connection = c;
        }
    }, {
        key: "removeConnection",
        value: function removeConnection() {
            if (this.connection) this.connection.remove();
        }
    }, {
        key: "addControl",
        value: function addControl(control) {
            this.control = control;
            control.parent = this;
        }
    }, {
        key: "showControl",
        value: function showControl() {
            return this.connection === null && this.control !== null;
        }
    }, {
        key: "positionX",
        value: function positionX() {
            return this.node.position[0];
        }
    }, {
        key: "positionY",
        value: function positionY() {
            var node = this.node;

            return node.position[1] + node.headerHeight() + node.outputsHeight() + node.controlsHeight() + this.socket.margin + this.socket.radius + node.inputs.indexOf(this) * this.socket.height() + this.socket.margin;
        }
    }]);
    return Input;
}();

var Output = function () {
    function Output(title, socket) {
        classCallCheck(this, Output);

        this.node = null;
        this.connections = [];

        this.title = title;
        this.socket = socket;
    }

    createClass(Output, [{
        key: 'connectTo',
        value: function connectTo(input) {
            if (!(input instanceof Input)) throw new Error('Invalid input');
            if (!this.socket.compatibleWith(input.socket)) throw new Error('Sockets not compatible');
            if (input.hasConnection()) throw new Error('Input already has one connection');

            var connection = new Connection(this, input);

            this.connections.push(connection);
            return connection;
        }
    }, {
        key: 'connectedTo',
        value: function connectedTo(input) {
            return this.connections.some(function (item) {
                return item.input === input;
            });
        }
    }, {
        key: 'removeConnection',
        value: function removeConnection(connection) {
            var propagate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.connections.splice(this.connections.indexOf(connection), 1);
            if (propagate) connection.remove();
        }
    }, {
        key: 'removeConnections',
        value: function removeConnections() {
            this.connections.forEach(function (connection) {
                connection.remove();
            });
        }
    }, {
        key: 'positionX',
        value: function positionX() {
            return this.node.position[0] + this.node.width;
        }
    }, {
        key: 'positionY',
        value: function positionY() {
            var node = this.node;

            return node.position[1] + node.headerHeight() + this.socket.margin + this.socket.radius + node.outputs.indexOf(this) * this.socket.height();
        }
    }]);
    return Output;
}();

var Node = function () {
    function Node(title, width) {
        classCallCheck(this, Node);

        this.id = Node.incrementId();
        this.inputs = [];
        this.outputs = [];
        this.controls = [];

        this.position = [0, 0];
        this.title = {
            size: 0.01,
            text: title
        };
        this.margin = 0.005;
        this.width = width || 0.1;
        this.height = 0.05;
    }

    createClass(Node, [{
        key: 'update',
        value: function update() {
            this.height = this.headerHeight() + this.outputsHeight() + this.inputsHeight() + this.controlsHeight() + this.margin;
        }
    }, {
        key: 'headerHeight',
        value: function headerHeight() {
            return 2 * this.margin + this.title.size;
        }
    }, {
        key: 'controlsHeight',
        value: function controlsHeight() {
            return this.controls.reduce(function (a, b) {
                return a + b.height;
            }, 0);
        }
    }, {
        key: 'outputsHeight',
        value: function outputsHeight() {
            return this.outputs.reduce(function (a, b) {
                return a + b.socket.height();
            }, 0);
        }
    }, {
        key: 'inputsHeight',
        value: function inputsHeight() {
            return this.inputs.reduce(function (a, b) {
                return a + b.socket.height();
            }, 0);
        }
    }, {
        key: 'addControl',
        value: function addControl(control) {
            if (!(control instanceof Control)) throw new Error('Invalid instance');
            this.controls.push(control);
            control.parent = this;
            this.update();
            return this;
        }
    }, {
        key: 'addInput',
        value: function addInput(input) {
            if (!(input instanceof Input)) throw new Error('Invalid instance');
            if (input.node !== null) throw new Error('Input has already been added to the node');
            input.node = this;
            this.inputs.push(input);

            this.update();
            return this;
        }
    }, {
        key: 'addOutput',
        value: function addOutput(output) {
            if (!(output instanceof Output)) throw new Error('Invalid instance');
            if (output.node !== null) throw new Error('Output has already been added to the node');
            output.node = this;
            this.outputs.push(output);

            this.update();
            return this;
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.inputs.forEach(function (input) {
                input.removeConnection();
            });
            this.outputs.forEach(function (output) {
                output.removeConnections();
            });
        }
    }], [{
        key: 'incrementId',
        value: function incrementId() {
            if (!this.latestId) this.latestId = 1;else this.latestId++;
            return this.latestId;
        }
    }]);
    return Node;
}();

var NodeBuilder = function () {
    function NodeBuilder(name, initializer) {
        classCallCheck(this, NodeBuilder);

        this.name = name;
        this.initializer = initializer;
    }

    createClass(NodeBuilder, [{
        key: 'build',
        value: function build() {
            var node = this.initializer();

            if (!(node instanceof Node)) {
                throw new Error('Invalid node instance');
            }
            return node;
        }
    }]);
    return NodeBuilder;
}();

var NodeEditor = function () {
    function NodeEditor(id, builders, event) {
        classCallCheck(this, NodeEditor);


        var self = this;

        this.event = event;
        this.active = null;
        this.nodes = [];
        this.builders = builders;

        this.pickedOutput = null;
        this.dom = null;

        this.dom = document.getElementById(id);
        this.dom.tabIndex = 1;

        var nodeNames = builders.map(function (e) {
            return e.name;
        });

        this.contextMenu = new ContextMenu(nodeNames, this.addNode.bind(this));
        this.svg = d3.select(this.dom);

        this.clickable = this.svg.append('rect').attr('fill', 'transparent').on('click', this.areaClick.bind(this));

        this.x = d3.scaleLinear();
        this.y = d3.scaleLinear();

        this.view = this.svg.append('g');

        this.zoom = d3.zoom().scaleExtent([0.2, 1.5]).on('zoom', function () {
            self.view.attr('transform', d3.event.transform);
        });

        this.svg.call(this.zoom);

        this.valueline = d3.line().curve(d3.curveBasis);

        d3.select(window).on('mousemove', function () {
            self.updateConnections();
        }).on('keydown.' + id, self.keyDown.bind(this)).on('resize.' + id, function () {
            self.resize();
            self.update();
        });

        this.resize();
    }

    createClass(NodeEditor, [{
        key: 'getConnectionPath',
        value: function getConnectionPath(connection, x1, y1, x2, y2) {
            var distanceX = Math.abs(x1 - x2);
            var distanceY = y2 - y1;

            var p1 = [x1, y1];
            var p4 = [x2, y2];

            var p2 = [x1 + 0.3 * distanceX, y1 + 0.1 * distanceY];
            var p3 = [x2 - 0.3 * distanceX, y2 - 0.1 * distanceY];

            var points = [p1, p2, p3, p4];

            points.connection = connection;
            return points;
        }
    }, {
        key: 'resize',
        value: function resize() {
            var width = this.dom.parentElement.clientWidth;
            var height = this.dom.parentElement.clientHeight;

            this.svg.style('width', width + 'px').style('height', height + 'px');

            this.clickable.attr('width', width + 20).attr('height', height + 20);

            var size = width + height; // Math.max(width,height);

            this.x.range([0, size]);
            this.y.range([0, size]);

            this.zoom.translateExtent([[-size, -size / 2], [size * 2, size]]);
        }
    }, {
        key: 'updateNodes',
        value: function updateNodes() {
            var self = this;

            var rects = this.view.selectAll('rect.node').data(this.nodes, function (d) {
                return d.id;
            });

            rects.enter().append('rect').attr('class', 'node').on('click', function (d) {
                self.selectNode(d);
            }).call(d3.drag().on('drag', function (d) {
                d3.select(this).attr('cx', d.position[0] += self.x.invert(d3.event.dx)).attr('cy', d.position[1] += self.y.invert(d3.event.dy));
                self.update();
            })).attr('rx', function () {
                return 8;
            }).attr('ry', function () {
                return 8;
            });

            rects.exit().remove();

            this.view.selectAll('rect.node').attr('x', function (d) {
                return self.x(d.position[0]);
            }).attr('y', function (d) {
                return self.y(d.position[1]);
            }).attr('width', function (d) {
                return self.x(d.width);
            }).attr('height', function (d) {
                return self.y(d.height);
            }).attr('class', function (d) {
                return self.active === d ? 'node active' : 'node';
            });

            var titles = this.view.selectAll('text.title').data(this.nodes, function (d) {
                return d.id;
            });

            titles.enter().append('text').classed('title', true);

            titles.exit().remove();

            this.view.selectAll('text.title').attr('x', function (d) {
                return self.x(d.position[0] + d.margin);
            }).attr('y', function (d) {
                return self.y(d.position[1] + d.margin + d.title.size);
            }).text(function (d) {
                return d.title.text;
            }).attr('font-size', function (d) {
                return self.x(d.title.size) + 'px';
            });
        }
    }, {
        key: 'updateConnections',
        value: function updateConnections() {

            var self = this;

            this.valueline.x(function (d) {
                return self.x(d[0]);
            }).y(function (d) {
                return self.y(d[1]);
            });

            var pathData = [];

            for (var i in this.nodes) {
                var outputs = this.nodes[i].outputs;

                for (var j in outputs) {
                    var cons = outputs[j].connections;

                    for (var k in cons) {
                        var input = cons[k].input;
                        var output = cons[k].output;

                        pathData.push(this.getConnectionPath(cons[k], output.positionX(), output.positionY(), input.positionX(), input.positionY()));
                    }
                }
            }

            if (self.pickedOutput !== null) {
                var mouse = d3.mouse(this.view.node());
                var output = self.pickedOutput;
                var input = [self.x.invert(mouse[0]), self.y.invert(mouse[1])];

                pathData.push(this.getConnectionPath(null, output.positionX(), output.positionY(), input[0], input[1]));
            }

            var path = this.view.selectAll('path').data(pathData);

            path.exit().remove();

            var new_path = path.enter().append('path').each(function () {
                d3.select(this).moveToBack();
            }).on('click', this.areaClick.bind(this));

            this.view.selectAll('path').attr('d', this.valueline).classed('connection', true);
        }
    }, {
        key: 'updateSockets',
        value: function updateSockets() {
            var self = this;

            var groups = this.view.selectAll('g.gg').data(this.nodes, function (d) {
                return d.id;
            });

            var newGroups = groups.enter().append('g').classed('gg', true);

            groups.exit().remove();

            groups = newGroups.merge(groups);

            var inputs = groups.selectAll('circle.input').data(function (d) {
                return d.inputs;
            });

            inputs.exit().remove();
            var newInputs = inputs.enter().append('circle');

            inputs = newInputs.merge(inputs);

            inputs.attr('class', function (d) {
                return 'socket input ' + d.socket.id;
            });

            var outputs = groups.selectAll('circle.output').data(function (d) {
                return d.outputs;
            });

            outputs.exit().remove();
            var newOutputs = outputs.enter().append('circle');

            outputs = newOutputs.merge(outputs);

            outputs.attr('class', function (d) {
                return 'socket output ' + d.socket.id;
            });

            outputs.on('click', function (d) {
                self.pickedOutput = d;
            }).attr('cx', function (d) {
                return self.x(d.positionX());
            }).attr('cy', function (d) {
                return self.y(d.positionY());
            }).attr('r', function (d) {
                return self.x(d.socket.radius);
            }).append('title').text(function (d) {
                return d.socket.name + '\n' + d.socket.hint;
            });

            inputs.on('click', function (input) {
                if (self.pickedOutput === null) {
                    if (input.hasConnection()) {
                        self.pickedOutput = input.connection.output;
                        self.removeConnection(input.connection);
                    }
                    return;
                }

                if (input.hasConnection()) self.removeConnection(input.connection);

                try {
                    var connection = self.pickedOutput.connectTo(input);

                    self.event.connectionCreated(connection);
                } catch (e) {
                    alert(e.message);
                } finally {
                    self.pickedOutput = null;
                    self.update();
                }
            }).attr('cx', function (d) {
                return self.x(d.positionX());
            }).attr('cy', function (d) {
                return self.y(d.positionY());
            }).attr('r', function (d) {
                return self.x(d.socket.radius);
            }).append('title').text(function (d) {
                return d.socket.name + '\n' + d.socket.hint;
            });

            var inputTitles = groups.selectAll('text.input-title').data(function (d) {
                return d.inputs.filter(function (input) {
                    return !input.showControl();
                });
            });

            inputTitles.exit().remove();

            var newInputTitles = inputTitles.enter().append('text').classed('input-title', true).attr('alignment-baseline', 'after-edge').text(function (d) {
                return d.title;
            });

            inputTitles = newInputTitles.merge(inputTitles);

            inputTitles.attr('x', function (d) {
                return self.x(d.positionX() + d.socket.radius + d.socket.margin);
            }).attr('y', function (d) {
                return self.y(d.positionY() + d.socket.margin);
            });

            var outputTitles = groups.selectAll('text.output-title').data(function (d) {
                return d.outputs;
            });

            outputTitles.exit().remove();

            var newOutputTitles = outputTitles.enter().append('text').classed('output-title', true).attr('text-anchor', 'end').attr('alignment-baseline', 'after-edge').text(function (d) {
                return d.title;
            });

            outputTitles = newOutputTitles.merge(outputTitles);

            outputTitles.attr('x', function (d) {
                return self.x(d.positionX() - d.socket.radius - d.socket.margin);
            }).attr('y', function (d) {
                return self.y(d.positionY() + d.socket.margin);
            });
        }
    }, {
        key: 'updateControls',
        value: function updateControls() {
            var self = this;

            var groups = this.view.selectAll('g.controls').data(this.nodes, function (d) {
                return d.id;
            });

            var newGroups = groups.enter().append('g').classed('controls', true);

            groups.exit().remove();

            var controls = newGroups.merge(groups).selectAll('foreignObject.control').data(function (d) {
                return d.controls;
            });

            controls.exit().remove();

            var newControls = controls.enter().append('foreignObject').html(function (d) {
                return d.html;
            }).classed('control', true);

            newControls.merge(controls).attr('x', function (d) {
                return self.x(d.margin + d.parent.position[0]);
            }).attr('y', function (d) {

                var prevControlsHeight = 0;
                var l = d.parent.controls.indexOf(d);

                for (var i = 0; i < l; i++) {
                    prevControlsHeight += d.parent.controls[i].height;
                }return self.y(d.parent.headerHeight() + +d.parent.outputsHeight() + prevControlsHeight + d.parent.position[1]);
            }).attr('width', function (d) {
                return self.x(d.parent.width - 2 * d.margin);
            }).attr('height', function (d) {
                return self.y(d.height);
            });

            var inputControls = newGroups.merge(groups).selectAll('foreignObject.input-control').data(function (d) {
                return d.inputs.filter(function (input) {
                    return input.showControl();
                });
            });

            var newInputControls = inputControls.enter().append('foreignObject').html(function (d) {
                return d.control.html;
            }).classed('input-control', true);

            inputControls.exit().remove();

            newInputControls.merge(inputControls).attr('width', function (d) {
                return self.x(d.node.width - 2 * d.control.margin);
            }).attr('height', function (d) {
                return self.y(d.control.height);
            }).attr('x', function (d) {
                return self.x(d.positionX() + d.socket.radius + d.socket.margin);
            }).attr('y', function (d) {
                return self.y(d.positionY() - d.socket.radius - d.socket.margin);
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this.updateConnections();
            this.updateNodes();
            this.updateSockets();
            this.updateControls();
        }
    }, {
        key: 'areaClick',
        value: function areaClick() {
            if (this.pickedOutput !== null) {
                this.pickedOutput = null;
                this.update();
                return;
            }

            if (this.contextMenu.isVisible()) this.contextMenu.hide();else this.contextMenu.show(d3.event.clientX, d3.event.clientY);
        }
    }, {
        key: 'addNode',
        value: function addNode(node) {
            if (!(node instanceof Node)) {
                var builder = this.builders.find(function (b) {
                    return b.name === node;
                });

                var pos = d3.mouse(this.view.node());

                node = builder.build();
                node.position = [this.x.invert(pos[0]), this.y.invert(pos[1])];
            }

            this.nodes.push(node);

            this.event.nodeCreated(node);
            this.selectNode(node);
        }
    }, {
        key: 'keyDown',
        value: function keyDown() {
            if (this.dom !== document.activeElement) return;

            switch (d3.event.keyCode) {
                case 46:
                    this.removeNode(this.active);
                    this.update();
                    break;
                case 27:

                    break;
            }
        }
    }, {
        key: 'removeNode',
        value: function removeNode(node) {
            var index = this.nodes.indexOf(node);

            this.nodes.splice(index, 1);
            node.remove();
            this.event.nodeRemoved(node);

            if (this.nodes.length > 0) this.selectNode(this.nodes[Math.max(0, index - 1)]);
            this.update();
        }
    }, {
        key: 'removeConnection',
        value: function removeConnection(connection) {
            connection.remove();
            this.event.connectionRemoved(connection);
        }
    }, {
        key: 'selectNode',
        value: function selectNode(node) {
            if (this.nodes.indexOf(node) === -1) throw new Error('Node not exist in list');

            this.active = node;
            this.event.nodeSelected(node);
            this.update();
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.dom.remove();
        }
    }]);
    return NodeEditor;
}();

var Socket = function () {
    function Socket(id, name, hint) {
        classCallCheck(this, Socket);

        this.id = id;
        this.name = name;
        this.hint = hint;
        this.compatible = [];

        this.radius = 0.006;
        this.margin = 0.004;
    }

    createClass(Socket, [{
        key: 'combineWith',
        value: function combineWith(socket) {
            if (!(socket instanceof Socket)) throw new Error('Invalid socket');
            this.compatible.push(socket);
        }
    }, {
        key: 'compatibleWith',
        value: function compatibleWith(socket) {
            if (!(socket instanceof Socket)) throw new Error('Invalid socket');
            return this === socket || this.compatible.indexOf(socket) !== -1;
        }
    }, {
        key: 'height',
        value: function height() {
            return 2 * this.radius + 2 * this.margin;
        }
    }]);
    return Socket;
}();

exports.Connection = Connection;
exports.ContextMenu = ContextMenu;
exports.Control = Control;
exports.NodeEditor = NodeEditor;
exports.Events = Events;
exports.Input = Input;
exports.Node = Node;
exports.NodeBuilder = NodeBuilder;
exports.Output = Output;
exports.Socket = Socket;

}((this.D3NE = this.D3NE || {})));
