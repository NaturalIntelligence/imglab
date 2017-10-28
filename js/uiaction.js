
//Display image from the URL or file path
$('#imgUrlBtn').on('click', function() {
    $('#img').attr('src',  $('#image_url').val());
    $('#img').attr('label',$('#image_url').val());
    images = { };
    images[$('#image_url').val()] = {
            name : $('#image_url').val()
        }
});

$('#clrPointsBtn').on('click', function() {
    deleteAll();
    deselectAll();
});

$('#plotActualBtn').on('click', function() {
	deleteAll();
    actualData = JSON.parse($("#actualData").val());
    alteredData = JSON.parse($("#actualData").val());
    plotWith(actualData);
});

$('#img').on('load',function(){
    deleteAll();
    drawAllBoxData(images[$(this).attr('label')].boxes);
    deselectAll();

    $("#imgdimentions").text("w:" + $('#img').width() + ", h:" + $('#img').height());
    $("#img_overlay").width($("#img").width());
	$("#img_overlay").height($("#img").height());
});

//To display conrdinates
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


//Create a box
$("#img_overlay").mouseup(function(event) {
    if(tmpBox != ""){
        if(tmpBox.width() < 20 || tmpBox.height() < 20){
            tmpBox.remove();
        }else{
            tmpBox.attr("label", $("#img_overlay .facebox").length);
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
            select(point);
        }
    }else{
        //Select the box to change box settings
    }

});

$(document).on('click', '.facebox', function(ev){
    //ev.stopPropagation()

    if(!document.getElementById('plotType').checked) {
    }else{
        select($(ev.target));
        //Select the box to change box settings
        //$(ev.el).addClass("selected");
    }

});

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
        deleteAll();
        $('#img').attr("src", "");
        images = {}; //create an empty list
        imagesData = {};
        for(i=0;i<input.files.length;i++){
            readFile(input.files[i]);
        }
    }
}

function readFile(f){
    if(f.type.startsWith("image")){
        var reader = new FileReader();
        reader.onload = function (e) {
            images[f.name] = { name : f.name};
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

function readPointsFile(input) {
    if (input.files && input.files[0]) {

        
        var reader = new FileReader();

        reader.onload = function (e) {
            
            //$('#img').attr('src', e.target.result)
            //detect the filetype and drawPoints()
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$("#boxtxtbox").on("input",function(ev){
    $(".facebox.selected").attr("label",$("#boxtxtbox").val());
})

$("#lbltxtbox").on("input",function(ev){
    $(".ptn.selected").attr("label",$("#lbltxtbox").val());
})

$(".deleteBtn").click(function(){
    $(".selected").remove();
    hideWidgets();
});

$("#emptyBox").click(function(){
    $(".selected").empty();
});

var deleteAll= function(){
    $("#img_overlay").empty();
}

$("#exportBtn").click(function(){
    download(JSON.stringify(images),"labelled.json","text/plain");
})

$("#exportDlibBtn").click(function(){
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