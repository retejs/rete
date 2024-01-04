/*!
* rete v2.0.2
* (c) 2024 Vitaliy Stoliarov
* Released under the MIT license.
* */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _assertThisInitialized = require('@babel/runtime/helpers/assertThisInitialized');
var _inherits = require('@babel/runtime/helpers/inherits');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _regeneratorRuntime = require('@babel/runtime/regenerator');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _assertThisInitialized__default = /*#__PURE__*/_interopDefaultLegacy(_assertThisInitialized);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* eslint-disable @typescript-eslint/naming-convention */

/**
 * A middleware type that can modify the data
 * @typeParam T - The data type
 * @param data - The data to be modified
 * @returns The modified data or undefined
 * @example (data) => data + 1
 * @example (data) => undefined // will stop the execution
 * @internal
 */

/**
 * Validate the Scope signals and replace the parameter type with an error message if they are not assignable
 * @internal
 */

/**
 * Provides 'debug' method to check the detailed assignment error message
 * @example .debug($ => $)
 * @internal
 */
function useHelper() {
  return {
    debug: function debug(f) {
    }
  };
}

/**
 * A signal is a middleware chain that can be used to modify the data
 * @typeParam T - The data type
 * @internal
 */
var Signal = /*#__PURE__*/function () {
  function Signal() {
    _classCallCheck__default["default"](this, Signal);
    _defineProperty__default["default"](this, "pipes", []);
  }
  _createClass__default["default"](Signal, [{
    key: "addPipe",
    value: function addPipe(pipe) {
      this.pipes.push(pipe);
    }
  }, {
    key: "emit",
    value: function () {
      var _emit = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(context) {
        var current, _iterator, _step, pipe;
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              current = context;
              _iterator = _createForOfIteratorHelper$1(this.pipes);
              _context.prev = 2;
              _iterator.s();
            case 4:
              if ((_step = _iterator.n()).done) {
                _context.next = 13;
                break;
              }
              pipe = _step.value;
              _context.next = 8;
              return pipe(current);
            case 8:
              current = _context.sent;
              if (!(typeof current === 'undefined')) {
                _context.next = 11;
                break;
              }
              return _context.abrupt("return");
            case 11:
              _context.next = 4;
              break;
            case 13:
              _context.next = 18;
              break;
            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](2);
              _iterator.e(_context.t0);
            case 18:
              _context.prev = 18;
              _iterator.f();
              return _context.finish(18);
            case 21:
              return _context.abrupt("return", current);
            case 22:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[2, 15, 18, 21]]);
      }));
      function emit(_x) {
        return _emit.apply(this, arguments);
      }
      return emit;
    }()
  }]);
  return Signal;
}();
/**
 * Base class for all plugins and the core. Provides a signals mechanism to modify the data
 */
var Scope = /*#__PURE__*/function () {
  // Parents['length'] extends 0 ? undefined : Scope<Parents[0], Tail<Parents>>

  function Scope(name) {
    _classCallCheck__default["default"](this, Scope);
    _defineProperty__default["default"](this, "signal", new Signal());
    this.name = name;
  }
  _createClass__default["default"](Scope, [{
    key: "addPipe",
    value: function addPipe(middleware) {
      this.signal.addPipe(middleware);
    }
  }, {
    key: "use",
    value: function use(scope) {
      if (!(scope instanceof Scope)) throw new Error('cannot use non-Scope instance');
      scope.setParent(this);
      this.addPipe(function (context) {
        return scope.signal.emit(context);
      });
      return useHelper();
    }
  }, {
    key: "setParent",
    value: function setParent(scope) {
      this.parent = scope;
    }
  }, {
    key: "emit",
    value: function emit(context) {
      return this.signal.emit(context);
    }
  }, {
    key: "hasParent",
    value: function hasParent() {
      return Boolean(this.parent);
    }
  }, {
    key: "parentScope",
    value: function parentScope(type) {
      if (!this.parent) throw new Error('cannot find parent');
      if (type && this.parent instanceof type) return this.parent;
      if (type) throw new Error('actual parent is not instance of type');
      return this.parent;
    }
  }]);
  return Scope;
}();

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }
function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Signal types produced by NodeEditor instance
 * @typeParam Scheme - The scheme type
 * @priority 10
 * @group Primary
 */

/**
 * The NodeEditor class is the entry class. It is used to create and manage nodes and connections.
 * @typeParam Scheme - The scheme type
 * @priority 7
 * @group Primary
 */
var NodeEditor = /*#__PURE__*/function (_Scope) {
  _inherits__default["default"](NodeEditor, _Scope);
  var _super = _createSuper$1(NodeEditor);
  function NodeEditor() {
    var _this;
    _classCallCheck__default["default"](this, NodeEditor);
    _this = _super.call(this, 'NodeEditor');
    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "nodes", []);
    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "connections", []);
    return _this;
  }

  /**
   * Get a node by id
   * @param id - The node id
   * @returns The node or undefined
   */
  _createClass__default["default"](NodeEditor, [{
    key: "getNode",
    value: function getNode(id) {
      return this.nodes.find(function (node) {
        return node.id === id;
      });
    }

    /**
     * Get all nodes
     * @returns Copy of array with nodes
     */
  }, {
    key: "getNodes",
    value: function getNodes() {
      return this.nodes.slice();
    }

    /**
     * Get all connections
     * @returns Copy of array with onnections
     */
  }, {
    key: "getConnections",
    value: function getConnections() {
      return this.connections.slice();
    }

    /**
     * Get a connection by id
     * @param id - The connection id
     * @returns The connection or undefined
     */
  }, {
    key: "getConnection",
    value: function getConnection(id) {
      return this.connections.find(function (connection) {
        return connection.id === id;
      });
    }

    /**
     * Add a node
     * @param data - The node data
     * @returns Whether the node was added
     * @throws If the node has already been added
     * @emits nodecreate
     * @emits nodecreated
     */
  }, {
    key: "addNode",
    value: function () {
      var _addNode = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(data) {
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!this.getNode(data.id)) {
                _context.next = 2;
                break;
              }
              throw new Error('node has already been added');
            case 2:
              _context.next = 4;
              return this.emit({
                type: 'nodecreate',
                data: data
              });
            case 4:
              if (_context.sent) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", false);
            case 6:
              this.nodes.push(data);
              _context.next = 9;
              return this.emit({
                type: 'nodecreated',
                data: data
              });
            case 9:
              return _context.abrupt("return", true);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function addNode(_x) {
        return _addNode.apply(this, arguments);
      }
      return addNode;
    }()
    /**
     * Add a connection
     * @param data - The connection data
     * @returns Whether the connection was added
     * @throws If the connection has already been added
     * @emits connectioncreate
     * @emits connectioncreated
     */
  }, {
    key: "addConnection",
    value: function () {
      var _addConnection = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee2(data) {
        return _regeneratorRuntime__default["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.getConnection(data.id)) {
                _context2.next = 2;
                break;
              }
              throw new Error('connection has already been added');
            case 2:
              _context2.next = 4;
              return this.emit({
                type: 'connectioncreate',
                data: data
              });
            case 4:
              if (_context2.sent) {
                _context2.next = 6;
                break;
              }
              return _context2.abrupt("return", false);
            case 6:
              this.connections.push(data);
              _context2.next = 9;
              return this.emit({
                type: 'connectioncreated',
                data: data
              });
            case 9:
              return _context2.abrupt("return", true);
            case 10:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function addConnection(_x2) {
        return _addConnection.apply(this, arguments);
      }
      return addConnection;
    }()
    /**
     * Remove a node
     * @param id - The node id
     * @returns Whether the node was removed
     * @throws If the node cannot be found
     * @emits noderemove
     * @emits noderemoved
     */
  }, {
    key: "removeNode",
    value: function () {
      var _removeNode = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee3(id) {
        var index, node;
        return _regeneratorRuntime__default["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              index = this.nodes.findIndex(function (n) {
                return n.id === id;
              });
              node = this.nodes[index];
              if (!(index < 0)) {
                _context3.next = 4;
                break;
              }
              throw new Error('cannot find node');
            case 4:
              _context3.next = 6;
              return this.emit({
                type: 'noderemove',
                data: node
              });
            case 6:
              if (_context3.sent) {
                _context3.next = 8;
                break;
              }
              return _context3.abrupt("return", false);
            case 8:
              this.nodes.splice(index, 1);
              _context3.next = 11;
              return this.emit({
                type: 'noderemoved',
                data: node
              });
            case 11:
              return _context3.abrupt("return", true);
            case 12:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function removeNode(_x3) {
        return _removeNode.apply(this, arguments);
      }
      return removeNode;
    }()
    /**
     * Remove a connection
     * @param id - The connection id
     * @returns Whether the connection was removed
     * @throws If the connection cannot be found
     * @emits connectionremove
     * @emits connectionremoved
     */
  }, {
    key: "removeConnection",
    value: function () {
      var _removeConnection = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee4(id) {
        var index, connection;
        return _regeneratorRuntime__default["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              index = this.connections.findIndex(function (n) {
                return n.id === id;
              });
              connection = this.connections[index];
              if (!(index < 0)) {
                _context4.next = 4;
                break;
              }
              throw new Error('cannot find connection');
            case 4:
              _context4.next = 6;
              return this.emit({
                type: 'connectionremove',
                data: connection
              });
            case 6:
              if (_context4.sent) {
                _context4.next = 8;
                break;
              }
              return _context4.abrupt("return", false);
            case 8:
              this.connections.splice(index, 1);
              _context4.next = 11;
              return this.emit({
                type: 'connectionremoved',
                data: connection
              });
            case 11:
              return _context4.abrupt("return", true);
            case 12:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function removeConnection(_x4) {
        return _removeConnection.apply(this, arguments);
      }
      return removeConnection;
    }()
    /**
     * Clear all nodes and connections
     * @returns Whether the editor was cleared
     * @emits clear
     * @emits clearcancelled
     * @emits cleared
     */
  }, {
    key: "clear",
    value: function () {
      var _clear = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee5() {
        var _iterator, _step, connection, _iterator2, _step2, node;
        return _regeneratorRuntime__default["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.emit({
                type: 'clear'
              });
            case 2:
              if (_context5.sent) {
                _context5.next = 6;
                break;
              }
              _context5.next = 5;
              return this.emit({
                type: 'clearcancelled'
              });
            case 5:
              return _context5.abrupt("return", false);
            case 6:
              _iterator = _createForOfIteratorHelper(this.connections.slice());
              _context5.prev = 7;
              _iterator.s();
            case 9:
              if ((_step = _iterator.n()).done) {
                _context5.next = 15;
                break;
              }
              connection = _step.value;
              _context5.next = 13;
              return this.removeConnection(connection.id);
            case 13:
              _context5.next = 9;
              break;
            case 15:
              _context5.next = 20;
              break;
            case 17:
              _context5.prev = 17;
              _context5.t0 = _context5["catch"](7);
              _iterator.e(_context5.t0);
            case 20:
              _context5.prev = 20;
              _iterator.f();
              return _context5.finish(20);
            case 23:
              _iterator2 = _createForOfIteratorHelper(this.nodes.slice());
              _context5.prev = 24;
              _iterator2.s();
            case 26:
              if ((_step2 = _iterator2.n()).done) {
                _context5.next = 32;
                break;
              }
              node = _step2.value;
              _context5.next = 30;
              return this.removeNode(node.id);
            case 30:
              _context5.next = 26;
              break;
            case 32:
              _context5.next = 37;
              break;
            case 34:
              _context5.prev = 34;
              _context5.t1 = _context5["catch"](24);
              _iterator2.e(_context5.t1);
            case 37:
              _context5.prev = 37;
              _iterator2.f();
              return _context5.finish(37);
            case 40:
              _context5.next = 42;
              return this.emit({
                type: 'cleared'
              });
            case 42:
              return _context5.abrupt("return", true);
            case 43:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[7, 17, 20, 23], [24, 34, 37, 40]]);
      }));
      function clear() {
        return _clear.apply(this, arguments);
      }
      return clear;
    }()
  }]);
  return NodeEditor;
}(Scope);

/* global globalThis*/
var crypto = globalThis.crypto;

/**
 * @returns A unique id
 */
function getUID() {
  if ('randomBytes' in crypto) {
    return crypto.randomBytes(8).toString('hex');
  }
  var bytes = crypto.getRandomValues(new Uint8Array(8));
  var array = Array.from(bytes);
  var hexPairs = array.map(function (b) {
    return b.toString(16).padStart(2, '0');
  });
  return hexPairs.join('');
}

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * The socket class
 * @priority 7
 */
var Socket = /*#__PURE__*/_createClass__default["default"](
/**
 * @constructor
 * @param name Name of the socket
 */
function Socket(name) {
  _classCallCheck__default["default"](this, Socket);
  this.name = name;
});

/**
 * General port class
 */
var Port = /*#__PURE__*/_createClass__default["default"](
/**
 * Port id, unique string generated by `getUID` function
 */

/**
 * Port index, used for sorting ports. Default is `0`
 */

/**
 * @constructor
 * @param socket Socket instance
 * @param label Label of the port
 * @param multipleConnections Whether the output port can have multiple connections
 */
function Port(socket, label, multipleConnections) {
  _classCallCheck__default["default"](this, Port);
  this.socket = socket;
  this.label = label;
  this.multipleConnections = multipleConnections;
  this.id = getUID();
});

/**
 * The input port class
 * @priority 6
 */
var Input = /*#__PURE__*/function (_Port) {
  _inherits__default["default"](Input, _Port);
  var _super = _createSuper(Input);
  /**
   * @constructor
   * @param socket Socket instance
   * @param label Label of the input port
   * @param multipleConnections Whether the output port can have multiple connections. Default is `false`
   */
  function Input(socket, label, multipleConnections) {
    var _this;
    _classCallCheck__default["default"](this, Input);
    _this = _super.call(this, socket, label, multipleConnections);
    /**
     * Control instance
     */
    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "control", null);
    /**
     * Whether the control is visible. Can be managed dynamically by extensions. Default is `true`
     */
    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "showControl", true);
    _this.socket = socket;
    _this.label = label;
    _this.multipleConnections = multipleConnections;
    return _this;
  }

  /**
   * Add control to the input port
   * @param control Control instance
   */
  _createClass__default["default"](Input, [{
    key: "addControl",
    value: function addControl(control) {
      if (this.control) throw new Error('control already added for this input');
      this.control = control;
    }

    /**
     * Remove control from the input port
     */
  }, {
    key: "removeControl",
    value: function removeControl() {
      this.control = null;
    }
  }]);
  return Input;
}(Port);

/**
 * The output port class
 * @priority 5
 */
var Output = /*#__PURE__*/function (_Port2) {
  _inherits__default["default"](Output, _Port2);
  var _super2 = _createSuper(Output);
  /**
   * @constructor
   * @param socket Socket instance
   * @param label Label of the output port
   * @param multipleConnections Whether the output port can have multiple connections. Default is `true`
   */
  function Output(socket, label, multipleConnections) {
    _classCallCheck__default["default"](this, Output);
    return _super2.call(this, socket, label, multipleConnections !== false);
  }
  return _createClass__default["default"](Output);
}(Port);

/**
 * General control class
 * @priority 5
 */
var Control = /*#__PURE__*/_createClass__default["default"](
/**
 * Control id, unique string generated by `getUID` function
 */

/**
 * Control index, used for sorting controls. Default is `0`
 */

function Control() {
  _classCallCheck__default["default"](this, Control);
  this.id = getUID();
});

/**
 * Input control options
 */

/**
 * The input control class
 * @example new InputControl('text', { readonly: true, initial: 'hello' })
 */
var InputControl = /*#__PURE__*/function (_Control) {
  _inherits__default["default"](InputControl, _Control);
  var _super3 = _createSuper(InputControl);
  /**
   * @constructor
   * @param type Type of the control: `text` or `number`
   * @param options Control options
   */
  function InputControl(type, options) {
    var _this2;
    _classCallCheck__default["default"](this, InputControl);
    _this2 = _super3.call(this);
    _this2.type = type;
    _this2.options = options;
    _this2.id = getUID();
    _this2.readonly = options === null || options === void 0 ? void 0 : options.readonly;
    if (typeof (options === null || options === void 0 ? void 0 : options.initial) !== 'undefined') _this2.value = options.initial;
    return _this2;
  }

  /**
   * Set control value
   * @param value Value to set
   */
  _createClass__default["default"](InputControl, [{
    key: "setValue",
    value: function setValue(value) {
      var _this$options;
      this.value = value;
      if ((_this$options = this.options) !== null && _this$options !== void 0 && _this$options.change) this.options.change(value);
    }
  }]);
  return InputControl;
}(Control);

/**
 * The node class
 * @priority 10
 * @example new Node('math')
 */
var Node = /*#__PURE__*/function () {
  /**
   * Whether the node is selected. Default is `false`
   */

  function Node(label) {
    _classCallCheck__default["default"](this, Node);
    /**
     * Node id, unique string generated by `getUID` function
     */
    /**
     * Node inputs
     */
    _defineProperty__default["default"](this, "inputs", {});
    /**
     * Node outputs
     */
    _defineProperty__default["default"](this, "outputs", {});
    /**
     * Node controls
     */
    _defineProperty__default["default"](this, "controls", {});
    this.label = label;
    this.id = getUID();
  }
  _createClass__default["default"](Node, [{
    key: "hasInput",
    value: function hasInput(key) {
      return Object.prototype.hasOwnProperty.call(this.inputs, key);
    }
  }, {
    key: "addInput",
    value: function addInput(key, input) {
      if (this.hasInput(key)) throw new Error("input with key '".concat(String(key), "' already added"));
      Object.defineProperty(this.inputs, key, {
        value: input,
        enumerable: true,
        configurable: true
      });
    }
  }, {
    key: "removeInput",
    value: function removeInput(key) {
      delete this.inputs[key];
    }
  }, {
    key: "hasOutput",
    value: function hasOutput(key) {
      return Object.prototype.hasOwnProperty.call(this.outputs, key);
    }
  }, {
    key: "addOutput",
    value: function addOutput(key, output) {
      if (this.hasOutput(key)) throw new Error("output with key '".concat(String(key), "' already added"));
      Object.defineProperty(this.outputs, key, {
        value: output,
        enumerable: true,
        configurable: true
      });
    }
  }, {
    key: "removeOutput",
    value: function removeOutput(key) {
      delete this.outputs[key];
    }
  }, {
    key: "hasControl",
    value: function hasControl(key) {
      return Object.prototype.hasOwnProperty.call(this.controls, key);
    }
  }, {
    key: "addControl",
    value: function addControl(key, control) {
      if (this.hasControl(key)) throw new Error("control with key '".concat(String(key), "' already added"));
      Object.defineProperty(this.controls, key, {
        value: control,
        enumerable: true,
        configurable: true
      });
    }
  }, {
    key: "removeControl",
    value: function removeControl(key) {
      delete this.controls[key];
    }
  }]);
  return Node;
}();

/**
 * The connection class
 * @priority 9
 */
var Connection = /*#__PURE__*/_createClass__default["default"](
/**
 * Connection id, unique string generated by `getUID` function
 */

/**
 * Source node id
 */

/**
 * Target node id
 */

/**
 * @constructor
 * @param source Source node instance
 * @param sourceOutput Source node output key
 * @param target Target node instance
 * @param targetInput Target node input key
 */
function Connection(source, sourceOutput, target, targetInput) {
  _classCallCheck__default["default"](this, Connection);
  this.sourceOutput = sourceOutput;
  this.targetInput = targetInput;
  if (!source.outputs[sourceOutput]) {
    throw new Error("source node doesn't have output with a key ".concat(String(sourceOutput)));
  }
  if (!target.inputs[targetInput]) {
    throw new Error("target node doesn't have input with a key ".concat(String(targetInput)));
  }
  this.id = getUID();
  this.source = source.id;
  this.target = target.id;
});

var classic = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Socket: Socket,
  Port: Port,
  Input: Input,
  Output: Output,
  Control: Control,
  InputControl: InputControl,
  Node: Node,
  Connection: Connection
});

exports.ClassicPreset = classic;
exports.NodeEditor = NodeEditor;
exports.Scope = Scope;
exports.Signal = Signal;
exports.getUID = getUID;
//# sourceMappingURL=rete.common.js.map
