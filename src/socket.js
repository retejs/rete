export class Socket {

   

   constructor(id, name, hint) {
      this.id = id;
      this.name = name;
      this.hint = hint;
	  
	  this.radius = 0.006; 
	  this.margin = 0.004;
   }

   height() {
      return this.radius * 2 + this.margin;
   }
}