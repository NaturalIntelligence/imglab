
//Display image from the URL or file path
$('#imgUrlBtn').on('click', function() {
    $('#img').attr('src',  $('#image_url').val());
    currentImg = {
        location : $('#image_url').val()
    }
    images = [ currentImg];
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
    deleteAll();deselectAll();

    $("#imgdimentions").text("w:" + $('#img').width() + ", h:" + $('#img').height());
    $("#img_overlay").width($("#img").width());
	$("#img_overlay").height($("#img").height());
});

//To display conrdinates
//To draw rectangle
$("#img_overlay").mousemove(function(event) {
    $("#tooltip-span").show();
    var cordinates = getCordinates(event,this);
    $("#tooltip-span").css({"left" : cordinates.x + 15 + "px", "top" : cordinates.y + 15 + "px"});
    $("#tooltip-span").html("x:" + cordinates.x + "<br> y:" + cordinates.y);

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

$("#img_overlay").mouseup(function(event) {
    if(tmpBox != ""){
        if(tmpBox.width() < 20 || tmpBox.height() < 20){
            tmpBox.remove();
        }else{
            select(tmpBox);
        }
    }
    tmpBox = "";
    
});

$("#img_overlay").mouseout(function(event) {
    $("#tooltip-span").hide();
});

//To create new point
/* To bind an event with elements dynamically created.*/
$(document).on('mousedown', '.facebox', function(ev){
    //ev.stopPropagation()

    if(!document.getElementById('plotType').checked) {
        //Create a point

        if($(ev.target).is('div.facebox')){
            var cordinates = getCordinates(ev);
            confirm(cordinates);
        }
    }else{
        //Select the box to change box settings
    }

});

$(document).on('click', '.facebox', function(ev){
    //ev.stopPropagation()

    if(!document.getElementById('plotType').checked) {
       
    }else{
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
    if(document.getElementById('plotType').checked) { //Box operation

        if ($(ev.target).is('div.facebox')){ // select the box
             //ev.stopPropagation();
             toggleSelect($(ev.target));
             return;
        }else{
            deselect($(ev.target));
            var cordinates = getCordinates(ev,this);
            tmpBox = $("<div class='facebox'></div>")
                .css({ top : cordinates.y, left : cordinates.x})
                .appendTo($("#img_overlay"));
            //makeItDraggable(tmpBox);
            
            startingPosition = tmpBox.position();
        }
    } else {
        //do nothing
    }

    /*if ($(ev.target).is('div.facebox')){
         //ev.stopPropagation();
         return;
    }*/
    
});

/************* Select,Deselect an element and show corresponding widget */
function deselectAll(){
    $("#boxDtl, #ptnDtl").hide();
    $("#boxDtl, #ptnDtl").removeClass("selected");
}

function select(el){
    deselectAll();
    $(el).addClass("selected");
    if($(el).hasClass("facebox")){
        displayBoxWidget(el)
    }else{
        displayPointWidget(el)
    }
}

function deselect(el){
    $(el).removeClass("selected");
    if($(el).hasClass("facebox")){
        $("#boxDtl").hide();
    }else{
        $("#ptnDtl").hide();
    }
}

function toggleSelect(el){
    if($(el).hasClass("selected")){
        deselect(el);
    }else{
        select(el);
    }

}

function displayBoxWidget(el){
    $("#lbltxtbox").val("Unknown");
    $("#div_l").text(el.position().left);
    $("#div_t").text(el.position().top);
    $("#div_w").text(el.width());
    $("#div_h").text(el.height());
    $("#boxDtl").show();
}

function displayPointWidget(el){
    $("#lbltxtbox").val("Unknown");
    $("#div_x").text($(el).position().left);
    $("#div_y").text($(el).position().top);
    $("#ptnDtl").show();
}
/*************End: Select,Deselect an element and show corresponding widget */

$("#plotType").click(function(ev){
    jsPlumb.toggleDraggable($(".facebox"));
});


function makeItDraggable(el){
  jsPlumb.draggable(el,{
    /*drag: function(e){
        //console.log(e.pos[0]); // for left position
        //console.log(e.pos[1]); // for top position
    },
    stop: function(e){
        //do something
    }*/
  });
}

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
    if(element){
        var x = event.pageX + $("#img_home").scrollLeft() - $("#img_home").offset().left - element.offsetLeft;
        var y = event.pageY + $("#img_home").scrollTop() - $("#img_home").offset().top - element.offsetTop;
    }else{
        var x = event.pageX + $("#img_home").scrollLeft() - $("#img_home").offset().left;
        var y = event.pageY + $("#img_home").scrollTop() - $("#img_home").offset().top;
    }
    return {x:x,y:y};
}

/*  To show the image*/
function readURL(input) {
    readFolder(input);
}



function readFolder(input) {
    emptySlider();
    if (input.files) {
        images = []; //create an empty list

        for(i=0;i<input.files.length;i++){
            readFile(input.files[i],i);
        }
    }
}

function readFile(f,i){
    if(f.type.startsWith("image")){
        var reader = new FileReader();
        reader.onload = function (e) {
            var imgData = {
                location : f.name,
                data: e.target.result,
                seq:i
            };
            images.push(imgData); 
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



