function ColorTool(){

  var colorActive = null;
  var canvasTool = null;

  $(".color-tool").find("li").each(function(){

    $(this).css("background-color", $(this).data("color"));

    $(this).click(function(){

      pickedColor($(this).data("color"));

      $(".color-tool").find("li").removeClass("active");
      $(this).addClass("active");
    });
  });

  function pickedColor(color){
    colorActive = color;

    canvasTool.penColor(colorActive);
  }

  this.canvasColor = function(canvas){
    canvasTool = canvas
  }
}
