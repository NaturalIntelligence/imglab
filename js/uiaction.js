//Display image from the URL or file path
$('#imgUrlBtn').on('click', function() {
    $('#img').attr('src',  $('#image_url').val());
});

$('#clrPointsBtn').on('click', function() {
    deleteAllPoints();
});

$('#plotActualBtn').on('click', function() {
	deleteAllPoints();
    actualData = JSON.parse($("#actualData").val());
    alteredData = JSON.parse($("#actualData").val());
    plotWith(actualData);
});

$('#img').on('load',function(){
    $("#imgdimentions").text($('#img').width() + "," + $('#img').height());
    $("#img_overlay").width($("#img").width());
	$("#img_overlay").height($("#img").height());
});

//To display conrdinates
$("#img_overlay").mousemove(function(event) {
    var cordinates = getCordinates(event,this);
    $("#tooltip-span").css({"left" : cordinates.x + 15 + "px", "top" : cordinates.y + 15 + "px"});
    $("#tooltip-span").html("x:" + cordinates.x + "<br> y:" + cordinates.y);
});

//To create new point
$("#img_overlay").mousedown(function (ev) {
    var cordinates = getCordinates(ev,this);
    confirm(cordinates);
})


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
    var x = event.pageX + $("#img_home").scrollLeft() - $("#img_home").get(0).offsetLeft - element.offsetLeft;
    var y = event.pageY + $("#img_home").scrollTop() - $("#img_home").get(0).offsetTop - element.offsetTop;
    return {x:x,y:y};
}

/*  To show the image*/
function readURL(input) {
    console.log("show image")
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img').attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    }
}