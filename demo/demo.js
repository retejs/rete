  window.onload = function() {

      var events = new D3NE.Events();

      events.nodeCreated = function(i) {
          console.log('nodeCreated');
      };

      events.connectionCreated = function(i) {
          console.log('connectionCreated');
      };

      events.nodeSelected = function(i) {
          console.log('nodeSelected');
      };

      events.connectionSelected = function(i) {
          console.log('connectionSelected');
      };

      events.nodeRemoved = function(i) {
          console.log('nodeRemoved');
      };

      events.connectionRemoved = function(i) {
          console.log('connectionRemoved');
      };
        
	  var numSocket = new D3NE.Socket('number', 'Number value', 'hint');
      var imageSocket = new D3NE.Socket('image', 'Image', 'hint');
      var arraySocket = new D3NE.Socket('array', 'Array', 'hint');
      
      numSocket.combineWith(imageSocket);

      var shapebuilder = new D3NE.NodeBuilder('Shape', function() {
            
          var input1 = new D3NE.Input('Texture', imageSocket);
          var input2 = new D3NE.Input('Value', numSocket);
          var out1 = new D3NE.Output('Array', arraySocket);
         
          var selectControl = new D3NE.Control(`<select>
          <option>111</option><option>222</option>
          </select>`);
          var numControl = new D3NE.Control('<input type="number">');
        
          return new D3NE.Node('Shape')
                    .addControl(selectControl)
                    .addControl(numControl)    
            			  .addInput(input1)
            				.addInput(input2)
         						.addOutput(out1);			
      });
         
      var texturebuilder = new D3NE.NodeBuilder('Texture', function() {
            
          var out = new D3NE.Output('Texture', imageSocket);
          var inp = new D3NE.Input('Texture', imageSocket);
          
          var numControl = new D3NE.Control('<input type="number">');

          inp.addControl(numControl);

          return new D3NE.Node('Texture')
         						.addInput(inp)
         						.addOutput(out);
      });
         
      var valbuilder = new D3NE.NodeBuilder('Value', function() {
            
          var out = new D3NE.Output('Number', numSocket);

          return new D3NE.Node('Value')
         						.addOutput(out);
      });
		 
      var tnode2 = texturebuilder.build();
      var tnode = texturebuilder.build();
      var vnode = valbuilder.build();
      var snode = shapebuilder.build();
      
      tnode2.position = [0.08, 0.1];
      tnode.position = [0.2, 0.1];
      snode.position = [0.4, 0.2];
      vnode.position = [0.25, 0.3];
		
      tnode.outputs[0].connectTo(snode.inputs[0]);
      vnode.outputs[0].connectTo(snode.inputs[1]);
      tnode2.outputs[0].connectTo(tnode.inputs[0]);
      
      var nodeEditor = new D3NE.NodeEditor('nodeEditor', 
             				[shapebuilder, texturebuilder, valbuilder],
                                         events);

      nodeEditor.addNode(tnode2);
      nodeEditor.addNode(tnode);
      nodeEditor.addNode(snode);
      nodeEditor.addNode(vnode);
      nodeEditor.selectNode(tnode);

  }