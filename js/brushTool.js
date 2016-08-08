function BrushTool(){

  var canvasBrush = null;
  var lineWidth = null;
  var opacityValue = null;
  var fillShape = false;

  progressRange($('#sizeWidth'), 18 - 4, $('#sizeWidth').val() - 4);

  $("#sizeWidth").change(function(){
    lineWidth = $(this).val();
    var constVal = 4;
    canvasBrush.penWidth(lineWidth);
    progressRange($(this), 18 - constVal, lineWidth - constVal);
  });

  $("#opacityValue").change(function(){
    opacityValue = $(this).val();
    canvasBrush.penOpacity(opacityValue);

    progressRange($(this), 1.0, opacityValue);
  });

  $("#rectTool").click(function(){
    if($(this).children('i').hasClass('flaticon-signal') && $(this).hasClass('selected')){
      $(this).children('i').removeClass('flaticon-signal');
      $(this).children('i').addClass('flaticon-black');
      fillShape = true;
    } else {
      $(this).children('i').removeClass('flaticon-black');
      $(this).children('i').addClass('flaticon-signal');
      fillShape = false;
    }
  });

  $("#circleTool").click(function(){
    if($(this).children('i').hasClass('flaticon-circle') && $(this).hasClass('selected')){
      $(this).children('i').removeClass('flaticon-circle');
      $(this).children('i').addClass('flaticon-shape');
      fillShape = true;
    } else {
      $(this).children('i').removeClass('flaticon-shape');
      $(this).children('i').addClass('flaticon-circle');
      fillShape = false;
    }
  });

  $("#triangleTool").click(function(){
    if($(this).children('i').hasClass('flaticon-triangle') && $(this).hasClass('selected')){
      $(this).children('i').removeClass('flaticon-triangle');
      $(this).children('i').addClass('flaticon-up-arrow');
      fillShape = true;
    } else {
      $(this).children('i').removeClass('flaticon-up-arrow');
      $(this).children('i').addClass('flaticon-triangle');
      fillShape = false;
    }
  });

  function progressRange(elem, maxVal, atualVal) {
    var progressBar = elem.siblings('.progress');
    progressBar.css("width", (((atualVal / maxVal) * 100)) + "%");
  }

  this.canvasBrush = function(canvas) {
    canvasBrush = canvas;
    console.log(canvasBrush);
  }


  this.isFill = function(){
    return fillShape;
  }

  this.width = function(){
    return lineWidth;
  }
}
