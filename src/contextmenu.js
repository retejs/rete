class ContextMenu{
   
   visible = false;

   constructor(items, onselect) {

      this.menu = d3.select('body')
      .append('div')
      .classed('context-menu', true)
      .style('display', 'none');

      this.item = this.menu.selectAll('div.item')
      .data(items)
      .enter()
      .append('div')
      .classed("item", true)
      .text(function(d) {
         return d;
      })
      .on('click', (d) => {
         onselect(d);
         this.hide();
      });
   }
      
   isVisible() {
      return this.visible;
   }

   show(x, y) {
      this.visible = true;
      this.menu
         .style("left", x + "px")
         .style("top", y + "px")
         .style('display', 'block');
   }

   hide() {
      this.visible = false;
      this.menu
         .style('display', 'none');
   }
}