  window.onload = function() {

         var events = new Events();

         events.nodeCreated = function(i) {
            console.log('nodeCreated');
         };

         events.edgeCreated = function(i) {
            console.log('edgeCreated');
         };

         events.nodeSelected = function(i) {
            console.log('nodeSelected');
         };

         events.edgeSelected = function(i) {
            console.log('edgeSelected');
         };

         events.nodeRemoved = function(i) {
            console.log('nodeRemoved');
         };

         events.edgeRemoved = function(i) {
            console.log('edgeRemoved');
         };

        
		 var numSocket = new Socket('number', 'Number value', 'hint');
         var imageSocket = new Socket('image', 'Image', 'hint');
         var arraySocket = new Socket('array', 'Array', 'hint');

		
         var shapebuilder = new NodeBuilder("Shape",function(){
            
            var input1 = new Input("Texture",imageSocket);
            var input2 = new Input("Value",numSocket);
            var out1 = new Output("Array",arraySocket);
            return new Node("Shape")
            					.addInput(input1)
            					.addInput(input2)
         						.addOutput(out1);			
         });
         
         var texturebuilder = new NodeBuilder("Texture",function(){
            
            var out = new Output("Texture",imageSocket);
            return new Node("Texture")
         						.addOutput(out);
         });
         
         var valbuilder = new NodeBuilder("Value",function(){
            
            var out = new Output("Number",numSocket);
            return new Node("Value")
         						.addOutput(out);
         });
         
		 
		var tnode = texturebuilder.build();
		tnode.position = [0.2,0.1];
		var snode = shapebuilder.build();
		snode.position = [0.4,0.2];
		var vnode = valbuilder.build();
		vnode.position = [0.3,0.3];
		
		tnode.outputs[0].connectTo(snode.inputs[0]);
		vnode.outputs[0].connectTo(snode.inputs[1]);
		
        var nodeEditor = new NodeEditor('nodeEditor', 
             				[tnode,snode,vnode],
             				[shapebuilder,texturebuilder,valbuilder],
                                         events);
	
        nodeEditor.selectNode(tnode);

      }