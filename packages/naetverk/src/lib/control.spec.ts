import { Control } from './control';
import { Node } from './node';
import { Input } from './input';
import { Socket } from './socket';

class MyControl extends Control {
  constructor(key?: any) {
    super(key);
  }
}

describe('Control', () => {
  it('should init', () => {
    expect(() => new Control('test')).toThrow(
      'Can not construct abstract class'
    );
    expect(() => new MyControl()).toThrow(
      'The key parameter is missing in super() of Control'
    );
    expect(() => new MyControl('test')).not.toThrow(
      'The key parameter is missing in super() of Control'
    );
  });

  it('should throw an error if a controll isnt added to a Node/Input', () => {
    const node = new Node('test');
    const ctrl = new MyControl('test');

    expect(() => ctrl.getNode()).toThrow("Control isn't added to Node/Input");
    node.addControl(ctrl);
    expect(() => ctrl.getNode()).not.toThrow(
      "Control isn't added to Node/Input"
    );
  });

  it('add to input', () => {
    const socket = new Socket('test');
    const input = new Input('key', 'Text', socket);
    const node = new Node('test');
    const ctrl = new MyControl('test');

    input.addControl(ctrl);

    expect(() => ctrl.getNode()).toThrow("Control isn't added to Node/Input");
    node.addInput(input);
    expect(() => ctrl.getNode()).not.toThrow(
      "Control isn't added to Node/Input"
    );

    node.data.testKey = 1;
    expect(ctrl.getData('testKey')).toEqual(1);

    expect(() => ctrl.putData('testKey2', 2)).not.toThrow('d');
    expect(ctrl.getData('testKey2')).toEqual(2);
  });
});
