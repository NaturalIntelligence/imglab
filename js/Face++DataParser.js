

var alteredData = { faces : [ {landmark : {}}]};
var actualData;


function fetch(){

	var formData = new FormData();
	
	formData.append('api_key', $("#api_key").val());
	formData.append('api_secret', $("#api_secret").val());
	formData.append('return_landmark', 1);
	//formData.append('return_attributes', "gender,age,smiling,headpose,facequality,blur,eyestatus,ethnicity,emotion");
	formData.append('return_attributes', "gender,age,headpose");
	if($("#image_url").val() != ""){
		formData.append('image_url', $("#image_url").val());
	}else{
		for(var i in $('input[type=file]')[0].files){
			var file = $('input[type=file]')[0].files[i];
			if(file.name == $("#img").attr("label")){
				formData.append('image_file', file); 				
			}
		}
		//formData.append('image_file', $('input[type=file]')[0].files[index]); 
		//formData.append('image_base64', $('#img').attr("src").substring("data:image/jpeg;base64,".length-1)); 
	}
	// Attach file

	$.ajax({
	    url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
	    data: formData,
	    type: 'POST',
	    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
	    processData: false, // NEEDED, DON'T OMIT THIS
	    success: function(data) {
            //jsonData = $.parseJSON(data);
            actualData = data;
            //alteredData = data;
            //$('#actualData').text(JSON.stringify(data));
            //$('#alteredData').text(JSON.stringify(data));
			//deleteAll();
			deleteAllLableBoxes();
            plotWith(data);
	    },
	    error: function(err) {
	    	$("#info").text("Error in connecting face++ API. Check console for more deetail");
	    	console.error("Error in connecting face++ API", err);
	    }
	});
}

function plotWith(jsonData){
	if(jsonData.faces.length > 0){
		jsonData.faces.forEach(function(face,index){
			//drawRectangle(face.face_rectangle,face.attributes.gender.value);
			var box = appendBox(face.face_rectangle);
			drawPoints(box,face.landmark);
			//jsPlumb.draggable($(".ptn"));
		});
		$("#info").text(jsonData.faces.length + " face(s) detected!!");
	}else{
		$("#info").text("No face detected!!");
	}
}

var drawPoints = function(el,landmark){
	var l = el.position().left, t = el.position().top; 

	labels.forEach(function(property,index){
		drawPoint({x: landmark[property].x - l,
				   y: landmark[property].y - t},el,property);
	});
	
}

