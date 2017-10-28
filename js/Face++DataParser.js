

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
		formData.append('image_file', $('input[type=file]')[0].files[0]); 
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
            $('#actualData').text(JSON.stringify(data));
            $('#alteredData').text(JSON.stringify(data));
            deleteAll();
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
			drawRectangle(face.face_rectangle,face.attributes.gender.value);
			drawPoints(index,face.landmark);
			//jsPlumb.draggable($(".ptn"));
		});
		$("#info").text(jsonData.faces.length + " face(s) detected!!");
	}else{
		$("#info").text("No face detected!!");
	}
}

var drawPoints = function(id,landmark){
	labels.forEach(function(property,index){
		drawPoint(id,landmark[property],index);
	});
	
}

