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
        
        //get height of display counterDisplay
        var displayHeight = centerDiameter*0.2;

        //set sizes for base circle
        $("#baseElement").css({
            "height": diameter + "px",
            "width": diameter + "px",
            "padding": outerPadding + "px",
            "top": ((height-diameter)/2) + "px",
            "left": ((width-diameter)/2) + "px"
            
        });
        // set size of inner circle that contains game controls
        $("#centerPanel").css({
            "height": centerDiameter + "px",
            "width": centerDiameter + "px",
            "top": (centerDiameter/2) +"px",
            "left": (centerDiameter/2) + "px"
        });
        //set size and position of step count display
        $("#counterDisplay p").css("font-size", displayHeight + "px");
        
        //set size of on/off toggle
        //width is 20% of parent's width
       var toggleWidth = $("#toggleContainer").outerWidth(true)*0.2;
       var borderSizeDouble = 4;
       //height is a little more than half the width
       var toggleHeight = toggleWidth*0.5667;
       var textSize = toggleHeight;
       
       //change size of on/off toggle and its text size
       $("#toggleContainer p").css("font-size", textSize + "px");
       $(".toggleSwitch").css({
          "width": (toggleWidth + borderSizeDouble ) + "px",
          "height": (toggleHeight + borderSizeDouble) + "px"
       });
       
       
       // set size of strict mode toggle's text size
       $(".toggleModeButton").css("font-size", (toggleHeight*0.7) + "px");
       //set font size of start reset button's label
       $("#startResetLabel").css("font-size", (toggleHeight*0.7) + "px");
        
    } //end of resizeElements
   
    $(window).resize(function(){
        resizeElements();
    });
});