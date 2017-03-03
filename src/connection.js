class Connection{
   
   constructor(output, input) {
      this.output = output;
      this.input = input;
      
      this.input.setConnection(this);
   }

   remove() {
      this.input.setConnection(null);
      this.output.removeConnection(this,false);
   }
}