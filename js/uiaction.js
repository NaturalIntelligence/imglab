
//Display image from the URL or file path
$('#imgUrlBtn').on('click', function() {
    $('#img').attr('src',  $('#image_url').val());
});

$('#clrPointsBtn').on('click', function() {
    deleteAll();
});

$('#plotActualBtn').on('click', function() {
	deleteAll();
    actualData = JSON.parse($("#actualData").val());
    alteredData = JSON.parse($("#actualData").val());
    plotWith(actualData);
});

$('#img').on('load',function(){
    deleteAll();
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
    if(tmpBox != "" && (tmpBox.width() < 20 || tmpBox.height() < 20)){
        tmpBox.remove();
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

/*$(document).on('click', '.ptn', function(ev){
    //ev.stopPropagation()

    if(!document.getElementById('plotType').checked) {
       
    }else{
        //Select the box to change box settings
        $(ev.el).addClass("selected");
    }

});*/

var tmpBox = "";
$("#img_overlay").mousedown(function (ev) {
    if(document.getElementById('plotType').checked) { //Box operation

        if ($(ev.target).is('div.facebox')){ // select the box
             //ev.stopPropagation();
             $(ev.target).toggleClass("selected");
             return;
        }else{
            $(".facebox").removeClass("selected");
            var cordinates = getCordinates(ev,this);
            tmpBox = $("<div class='facebox'></div>")
                .css({ top : cordinates.y, left : cordinates.x})
                .appendTo($("#img_overlay"));
            //makeItDraggable(tmpBox);
            tmpBox.addClass("selected");
            startingPosition = tmpBox.position();
        }
    } else {
        //do nothing
    }

    /*if ($(ev.target).is('div.facebox')){
         //ev.stopPropagation();
         return;
    }*/
    
})

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
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img').attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
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