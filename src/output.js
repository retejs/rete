import {Input} from './input';
import {Connection} from './connection';

export class Output{
  
   constructor(title, socket) {
	    this.node = null;
		this.connections = [];
	   
      this.title = title;
      this.socket = socket;
   }

   connectTo(input) {
      if (!(input instanceof Input)) throw new Error("Invalid input");
      if (this.socket !== input.socket) throw new Error("Sockets not compatible");
      if (input.hasConnection()) throw new Error("Input already has one connection");

      this.connections.push(new Connection(this, input));
   }

   connectedTo(input) {
      return this.connections.some(function(item) {
         return item.input === input;
      });
   }

   removeConnection(connection,propagate = true) {
      this.connections.splice(this.connections.indexOf(connection), 1);
      if(propagate)
         connection.remove();
   }

   removeConnections() {
      this.connections.forEach(function(connection) {
         connection.remove();
      });
   }

   positionX() {
      return this.node.position[0] + this.node.width;
   }

   positionY() {
      var node = this.node;
      return node.position[1] +
         node.headerHeight() +
         node.outputs.indexOf(this) * this.socket.height();
   }
}