export class Input{
   
  
   
   constructor(title, socket) {
	  this.node = null;
      this.connection = null;
      this.title = title;
      this.socket = socket;
   }

   hasConnection() {
      return this.connection !== null;
   }

   setConnection(c) {
      this.connection = c;
   }

   removeConnection() {
      if (this.connection)
         this.connection.remove();
   }

   positionX() {
      return this.node.position[0];
   }

   positionY() {
      var node = this.node;
      return node.position[1] +
         node.headerHeight() +
         node.inputs.indexOf(this) * this.socket.height() +
         node.outputsHeight();
   }
}