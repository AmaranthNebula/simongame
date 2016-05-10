$(document).ready(function() {
    resizeElements();
   $("button").click(function(e) {
       var name = $(this).attr("id");
       name = name.replace("Button", "");
      $(this).addClass(name + "Activated"); 
   });
    
    
    
    
    
    function resizeElements() {
        //check height and width and find the smaller dimension
        var width = $(window).outerWidth(true);
        var height = $(window).outerHeight(true);
        //diameter of base is 80% of the height or width (whichevers smaller)
        var diameter = Math.min(height, width)*0.8;
        // diameter of center panel
        var centerDiameter = diameter/2;
        var outerPadding = diameter * 0.05;
        
        
        //set sizes
        $("#baseElement").css({
            "height": diameter + "px",
            "width": diameter + "px",
            "padding": outerPadding + "px",
            "top": ((height-diameter)/2) + "px",
            "left": ((width-diameter)/2) + "px"
            
        });
        
        $("#centerPanel").css({
            "height": centerDiameter + "px",
            "width": centerDiameter + "px",
            "top": (centerDiameter/2) +"px",
            "left": (centerDiameter/2) + "px"
        });
    } //end of resizeElements
   
    $(window).resize(function(){
       resizeElements(); 
    });
});