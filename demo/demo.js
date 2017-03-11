  window.onload = function() {

         var events = new D3NE.Events();

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

        
		 var numSocket = new D3NE.Socket('number', 'Number value', 'hint');
         var imageSocket = new D3NE.Socket('image', 'Image', 'hint');
         var arraySocket = new D3NE.Socket('array', 'Array', 'hint');

		
         var shapebuilder = new D3NE.NodeBuilder("Shape",function(){
            
            var input1 = new D3NE.Input("Texture",imageSocket);
            var input2 = new D3NE.Input("Value",numSocket);
            var out1 = new D3NE.Output("Array",arraySocket);
            return new D3NE.Node("Shape")
            					.addInput(input1)
            					.addInput(input2)
         						.addOutput(out1);			
         });
         
         var texturebuilder = new D3NE.NodeBuilder("Texture",function(){
            
            var out = new D3NE.Output("Texture",imageSocket);
            return new D3NE.Node("Texture")
         						.addOutput(out);
         });
         
         var valbuilder = new D3NE.NodeBuilder("Value",function(){
            
            var out = new D3NE.Output("Number",numSocket);
            return new D3NE.Node("Value")
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
		
        var nodeEditor = new D3NE.NodeEditor('nodeEditor', 
             				[tnode,snode,vnode],
             				[shapebuilder,texturebuilder,valbuilder],
                                         events);
	
        nodeEditor.selectNode(tnode);

      }