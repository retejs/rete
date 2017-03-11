import {Input} from './input';
import {Output} from './output';

export class Node {
   
   constructor(title, width){
		this.inputs = [];
		this.outputs = [];

		this.position = [0, 0];
		this.title = {
			margin: 0.004,
			size: 0.009,
			color: 'white',
			text: ''
		};
		this.title.text = title;
		this.width = width || 0.1;
		this.height = 0.05;
   }

   update() {
      this.height = this.headerHeight() + this.outputsHeight() + this.inputsHeight();
   }

   headerHeight() {
      return 4 * this.title.margin + this.title.size;
   }

   outputsHeight() {
      return this.outputs.reduce(function(a, b) {
         return a + b.socket.height();
      }, 0);
   }

   inputsHeight() {
      return this.inputs.reduce(function(a, b) {
         return a + b.socket.height();
      }, 0);
   }

   addInput(input) {
      if (!(input instanceof Input)) throw new Error("Invalid instance");
      if (input.node !== null) throw new Error("Input has already been added to the node");
      input.node = this;
      this.inputs.push(input);

      this.update();
      return this;
   }

   addOutput(output) {
      if (!(output instanceof Output)) throw new Error("Invalid instance");
      if (output.node !== null) throw new Error("Output has already been added to the node");
      output.node = this;
      this.outputs.push(output);

      this.update();
      return this;
   }

   remove() {
      this.inputs.forEach(function(input) {
         input.removeConnection();
      });
      this.outputs.forEach(function(output) {
         output.removeConnections();
      })
   }
};