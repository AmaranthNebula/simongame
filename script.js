$(document).ready(function() {
   $("button").click(function(e) {
       var name = $(this).attr("id");
       name = name.replace("Button", "");
      $(this).addClass(name + "Activated"); 
   });
    
});