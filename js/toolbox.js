//this file is for managing tool box

var currentTool = "#toolBox";

function changeTool(newTool, newToolName){ // set currentTool to newTool
	$(currentTool).attr("disabled", false);
	currentTool = newTool;
	$(currentTool).attr("disabled", true);
	$("#toolboxInfo").html("Selected Tool: " + newToolName);
}

$("#toolBox").click(function(){
	changeTool("#toolBox", "Box");
	// from uiaction.js
    jsPlumb.setDraggable($(".facebox"),true);
	$("#emptyBox").slideDown(100);
});

$("#toolPoints").click(function(){
	changeTool("#toolPoints", "Points");
	// from uiaction.js
    jsPlumb.setDraggable($(".facebox"),false);
	$("#emptyBox").slideUp(200);
});

$("#toolR").click(function(){
	changeTool("#toolR", "some random tool");
})