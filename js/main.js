function Canvas2D($canvas) {
  var context = $canvas[0].getContext("2d");
      width = context.canvas.width;
      height = context.canvas.height;

  var pageOffSet = $canvas.offset();

  context.lineWidth = 4;
  context.strokeStyle = "#34495e";
  context.fillStyle = "#34495e";
  context.globalAlpha = 1.0;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.font = "24px Verdana, Geneva, sans-serif";
  context.textBaseline = "top";

  this.getAreaPoint = function(pageX, pageY){
    return {
      x: pageX - pageOffSet.left,
      y: pageY - pageOffSet.top
    }
  }

  this.clear = function(){
    context.clearRect(0, 0, width, height);
    return this;
  }

  this.drawPoints = function(points){
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for(var i = 0; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();
    return this;
  }

  this.drawLine = function(point1, point2) {
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke();
    return this;
  }

  this.drawRect = function(point1, point2, fill) {
    var w = point2.x - point1.x;
    var h = point2.y - point1.y;

    context.beginPath();
    if(fill){
      context.fillRect(point1.x, point1.y, w, h);
    }else{
      context.strokeRect(point1.x, point1.y, w, h);
    }
  }

  this.drawCircle = function(center, radius, fill) {
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI, true);
    if(fill){
      context.fill();
    } else {
      context.stroke();
    }
    return this;
  };

  this.drawTriangle = function(point1, point2, fill){
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point1.x, point2.y);
    context.lineTo(point2.x, point2.y);
    context.closePath();
    if(fill){
      context.fill();
    } else {
      context.stroke();
    }
    return this;
  }

  this.drawText = function(text, point, fill){

    fill = true;

    if(fill){
      context.fillText(text, point.x, point.y);
    }else{
      context.strokeText(text, point.x, point.y);
    }
    return this;
  }

  this.penWidth = function(newWidth) {
    if(arguments.length){
      context.lineWidth = newWidth;
      return this;
    }

    return context.lineWidth;
  }

  this.penOpacity = function(newOpacity) {
    if(arguments.length){
      context.globalAlpha = newOpacity;
      return this;
    }

    return context.globalAlpha;
  }

  this.penColor = function(newColor) {
    if(arguments.length){
      context.strokeStyle = newColor;
      context.fillStyle = newColor;
      return this;
    }

    return context.strokeStyle;
  }

  this.penSave = function(){
    context.save();
  }

  this.penRestore = function(){
    context.restore();
  }

}


function CanvasApp(){

  var canvas2d = new Canvas2D($("#micCanvas"));
  var colorTool = new ColorTool();
  var brushTool = new BrushTool();
  var curTool = "pen";
  var curAction = newAction(curTool);
  var drawing = false;
  var points = [];
  var actions = [];

  function onMouseMove(e) {
    penMove(e.pageX, e.pageY);
  }

  function onMouseDown(e){
    penDown(e.pageX, e.pageY);
  }

  function onMouseUp() {
    penUp();
  }

  function penMove(pageX, pageY) {
    var pointsMove = canvas2d.getAreaPoint(pageX, pageY);

    if(drawing){
      switch (curTool) {
        case 'pen':
          curAction.points.push(pointsMove);
          break;
        case 'line':
          curAction.points[1] = pointsMove;
          break;
        case 'rect':
          curAction.points[1] = pointsMove;
          break;
        case 'circle':
          curAction.points[1] = pointsMove;
          break;
        case 'triangle':
          curAction.points[1] = pointsMove;
          break;
      }
      redraw();
    }
  }

  function penDown(pageX, pageY) {

    $('body').addClass('bgDark');

    if(curTool == "text"){
      if($("#text-input").is(":visible")) return;
      showTextInput(pageX, pageY);
    }
    else {
      drawing = true;
    }

    curAction = newAction(curTool, brushTool.isFill());

    if(curAction.tool == 'text'){
      curAction.width = 1;
    }

    curAction.points.push(canvas2d.getAreaPoint(pageX, pageY));
    actions.push(curAction);
  }

  function penUp() {
    $('body').removeClass('bgDark');
    if(drawing){
      drawing = false;
    }

  }

  function changeTool(toolName){
    curTool = toolName;
  }

  function redraw(){
    canvas2d.clear();
    canvas2d.penSave();

    console.log(actions);

    for(var i = 0; i < actions.length; i++) {
      var action = actions[i];
      canvas2d.penColor(action.color).penWidth(action.width).penOpacity(action.opacity);
      switch (action.tool) {
        case 'pen':
          canvas2d.drawPoints(action.points);
          break;
        case 'line':
          canvas2d.drawLine(action.points[0], action.points[1]);
          break;
        case 'rect':
          canvas2d.drawRect(action.points[0], action.points[1], action.fill);
          break;
        case 'circle':
          var dx = Math.abs(action.points[1].x - action.points[0].x);
          var dy = Math.abs(action.points[1].y - action.points[0].y);
          radius = Math.min(dx, dy)
          canvas2d.drawCircle(action.points[0], radius, action.fill);
          break;
        case 'triangle':
          canvas2d.drawTriangle(action.points[0], action.points[1], action.fill);
          break;
        case 'text':
          canvas2d.drawText(action.text, action.points[0], action.fill);
          break;
      }

    }

    canvas2d.penRestore();
  }

  function newAction(tool, fillHere){
    return {
      tool: tool,
      color: canvas2d.penColor(),
      width: canvas2d.penWidth(),
      opacity: canvas2d.penOpacity(),
      fill: fillHere,
      points: []
    }
  }

  function showTextInput(pageX, pageY){
    $("#text-input").css("top", pageY).css("left", pageX).fadeIn('fast', function(){
      $("#text-input input").val("").focus();
    });
  }

  function validText(e){
    if(e.which == 13){
      curAction.text = $("#text-input input").val();
      $("#text-input").hide();
      redraw();
    } else if(e.which == 27){
      actions.pop();
      $("#text-input").hide();
    }
  }

  this.start = function(){
    $("#micCanvas").mousemove(onMouseMove).mousedown(onMouseDown).mouseup(onMouseUp).mouseout(onMouseUp);
    $(".toolItem").click(function(){
      $(".toolItem").removeClass('selected');
      $(this).addClass('selected');
      if(!$(this).hasClass('no-active')){
        changeTool($(this).data('option'));
      }
    });
    $("#text-input input").keydown(function(e){ validText(e); });
    colorTool.canvasColor(canvas2d);
    brushTool.canvasBrush(canvas2d);
  }
}
