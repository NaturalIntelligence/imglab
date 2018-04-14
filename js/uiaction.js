
//Display image from the URL or file path
$('#imgUrlBtn').on('click', function() {
    $('#img').attr('src',  $('#image_url').val());
    $('#img').attr('label',$('#image_url').val());
    if(!images) images = {};
    /* images[$('#image_url').val()] = {
        name : $('#image_url').val()
    } */
});

$('#clrPointsBtn').on('click', function() {
    clearCanvas();
    deselectAll();
    deleteLabels();
});

//plot points from point data file
$('#loadDataFileBtn').on('click', function() {
    $.confirm({
        title: 'Read me carefully',
        content: '<p>Due to the security reasons, browser doesn\'t allow me to load the images.'
            + '<br> So please load the images first before loading the label information.'
            + '<br> If you are ready click to \'open\' otherwise cancel.' 
        ,
        type: 'red',
        buttons: {   
            ok: {
                text: "open!",
                btnClass: 'btn-red',
                keys: ['enter'],
                action: function(){
                    $("#loadDataFileInput").click();
                }
            },
            cancel: function(){
            }
        }
    });
    //alert if anything is already open
    //alert for unsaved data
    //load images or ask user to load the images first as you can't install images
    //save data in global variable
    //plot data of currently displayed image
});


//plot points from textbox
$('#plotActualBtn').on('click', function() {
	clearCanvas();
    actualData = JSON.parse($("#actualData").val());
    alteredData = JSON.parse($("#actualData").val());
    plotWith(actualData);
});

//When an image clicked/selected in slider, loads in center/working area
$('#img').on('load',function(){
    //Clear previously loaded image and and all labelling information
    clearCanvas();
    var imageName = $(this).attr('label');
    images[imageName] && drawAllBoxData(images[imageName].boxes);
    deselectAll();
    
    //update widget
    $("#imgdimentions").text("w:" + $('#img').width() + ", h:" + $('#img').height());

    //update ovelay size
    $("#img_overlay").width($("#img").width());
	$("#img_overlay").height($("#img").height());
});

//To display cordinates
//To draw rectangle
$("#img_overlay").mousemove(function(event) {
    $("#tooltip-span").show();
    $("#h_line").show();
    $("#v_line").show();
    var cordinates = getCordinates(event,this);
    $("#tooltip-span").css({"left" : cordinates.x + 15 + "px", "top" : cordinates.y + 15 + "px"});
    $("#tooltip-span").html("x:" + cordinates.x + "<br> y:" + cordinates.y);
    $("#h_line").css({top : cordinates.y});
    $("#v_line").css({left: cordinates.x});
    if(tmpBox !== ""){
        drawFaceBox(cordinates);
    }
});

function drawFaceBox(cordinates){
    var position = tmpBox.position();
    var left = tmpBox.position().left,top = tmpBox.position().top;
    if (cordinates.x < startingPosition.left) {
        left = cordinates.x;
    }

    if (cordinates.y < startingPosition.top) {
        top = cordinates.y;
    } 

    $(tmpBox).css({
        top: top,
        left: left,
        width: Math.abs(cordinates.x - startingPosition.left) ,
        height: Math.abs(cordinates.y - startingPosition.top) ,
    })
}


//Create the label box when user stop playing
$("#img_overlay").mouseup(function(event) {
    if(tmpBox != ""){
        if(tmpBox.width() < 20 || tmpBox.height() < 20){
            tmpBox.remove();
        }else{
            tmpBox.attr("label", $("#img_overlay .facebox").length);
            updateLabelBox(tmpBox);
            select(tmpBox);
        }
    }
    tmpBox = "";
    
});

$("#img_overlay").mouseout(function(event) {
    $("#tooltip-span").hide();
    $("#h_line").hide();
    $("#v_line").hide();
});

//To create new point
/* To bind an event with elements dynamically created.*/
$(document).on('mousedown', '.facebox', function(ev){
    //ev.stopPropagation()

    if(!document.getElementById('plotType').checked) {
        //Create a point

        if($(ev.target).is('div.facebox')){
            var cordinates = getCordinates(ev,ev.target);
            var point = drawPoint(cordinates,ev.target);
            updateFeaturePoint(point);
            select(point);
        }
    }else{
        //Select the box to change box settings
    }

});

//select facebox
$(document).on('click', '.facebox', function(ev){
    //ev.stopPropagation()

    if(!document.getElementById('plotType').checked) {
    }else{
        select($(ev.target));
        //Select the box to change box settings
        //$(ev.el).addClass("selected");
    }

});

//select feature point / or landmark
$(document).on('click', '.ptn', function(ev){
    //ev.stopPropagation()

    if(!document.getElementById('plotType').checked) {
        toggleSelect(ev.target);
    }else{
        //Select the box to change box settings
        $(ev.el).addClass("selected");
    }

});

var tmpBox = "";

//start creating label box
$("#img_overlay").mousedown(function (ev) {
    deselectAll();
    if(document.getElementById('plotType').checked) { //Box operation

        if ($(ev.target).is('div.facebox')){ // select the box
             //ev.stopPropagation();
             toggleSelect($(ev.target));
             return;
        }else{
            deselect($(ev.target));
            var cordinates = getCordinates(ev,this);
            tmpBox = appendBox({ top : cordinates.y,
                                left : cordinates.x});
            
            startingPosition = tmpBox.position();
        }
    } else {
        //do nothing
    }
    
});

//decide if box or point should be dragged
$("#plotType").on("switchChange.bootstrapSwitch",function(ev){
    if(document.getElementById('plotType').checked){
        jsPlumb.setDraggable($(".facebox"),true);
    }else{
        jsPlumb.setDraggable($(".facebox"),false);
    }
});


$("#plotApiBtn").click(function(){
	if(faces.length > 0){
		faces.forEach(function(face){
			drawPoints(face);
		})
	}else{
		$("#info").text("No face to draw!!");
	}

});

$("#faceppBtn").click(function(){
	fetch();
});

//get mouse cordinates on image
 function getCordinates(event, element){
    var x = event.pageX + $("#img_home").scrollLeft() - $("#img_home").offset().left - element.offsetLeft;
    var y = event.pageY + $("#img_home").scrollTop() - $("#img_home").offset().top - element.offsetTop;
    return {x:x,y:y};
}

/* Load selected images or images fom a folder in slider*/
function readFiles(input) {
    if (input.files && input.files[0]) {
        emptySlider();
        hideWidgets();
        clearCanvas();
        $('#img').attr("src", "");
        //images = {}; //create an empty list
        imagesData = {};
        for(i=0;i<input.files.length;i++){
            readFile(input.files[i]);
        }
    }
}

/*read an image file and add to slider  saveAllBoxData();*/
function readFile(f){
    if(f.type.startsWith("image")){
        var reader = new FileReader();
        reader.onload = function (e) {
            //images[f.name] = { name : f.name};
            var imgData = {
                name : f.name,
                data: e.target.result
            };
            imagesData[f.name] = imgData
            addToSlider(imgData);
        }
        reader.readAsDataURL(f);
    }
}

/* For future use*/
function readPointsFile(input) {
    if (input.files && input.files[0]) {
        var pointFile = input.files[0];
        emptyCanvas();
        deselectAll();
        var reader = new FileReader();
        reader.onload = function (e) {
            if(pointFile.name.endsWith(".pts")){
                loadPts(e.target.result);
            }else if(pointFile.name.endsWith(".json")){
                loadJson(e.target.result);
            }else if(pointFile.name.endsWith(".fpp")){
                loadFpp(e.target.result);
            }else{
                console.log("Not supported");
            }
        };

        reader.readAsText(input.files[0]);
    }
}

//Box label
$("#boxtxtbox").on("input",function(ev){
    var oldLabel = $(".facebox.selected").attr("label");
    var newLabel = $("#boxtxtbox").val();

    $(".facebox.selected").attr("label",newLabel);//for next time
    updateLabelBoxLabel(oldLabel,newLabel);
})

$("#lbltxtbox").on("input",function(ev){
    var oldLabel = $(".ptn.selected").attr("label");
    var newLabel = $("#lbltxtbox").val();

    $(".ptn.selected").attr("label",newLabel);
    updateFeaturePointLabel($(".ptn.selected"),oldLabel,newLabel);
})

$(".deleteBtn").click(function(){
    if ( isLabelBox( $(".selected") ) ){
        deleteLabelBox($(".selected"));
    }else if( isFeaturePoint ( $(".selected") ) ){
        deleteFeaturePoint($(".selected"));
    }else{
        throw Error("Select a Label box or feature point to delete.");
    }
    $(".selected").remove();
    hideWidgets();
});

$("#emptyBox").click(function(){
    $(".selected").empty();
    deleteLabelBoxPoints($(".selected.facebox"));
});

//remove labeled boxes and points from canvas
var clearCanvas= function(){
    $("#img_overlay").empty();
}

//Unload any image from canvas and clear it
var emptyCanvas= function(){
    $("#img").attr("src", "");
    clearCanvas();
}

$("#exportBtn").click(function(){
    //save data of currently open image
    //saveAllBoxData();
    download(JSON.stringify(images),"labelled.json","text/plain");
})

$("#exportDlibBtn").click(function(){
    //save data of currently open image
    //saveAllBoxData();
    download(toDlib(images),"labelled.xml","text/plain");
})

$("#exportPtsBtn").click(function(){
    var box = $(".facebox.selected");
    if(box.length === 1){
        download(toDlibPts( box ),$("#img").attr("label")+".pts","text/plain");
    }else{
        $("#info").text("Please select a box.");
    }
})

function isLabelBox(el){
    return $(el).hasClass("facebox");
}

function isFeaturePoint(el){
    return $(el).hasClass("ptn");
}