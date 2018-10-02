/*var images = [{
    location : "",
    boxes : [{
        label : "",
        position : {}, //top,left,width,height
        points : []
    }]
}]*/

var images = {}; //contains label information
var imagesData = {}; //contains images data

//TODO: getIndexOfNextBox
function getNextBoxCounter(imgName){
    if(images[imgName].boxes){
        return images[imgName].boxes.length;
    }else{
        images[imgName].boxes = {};
        return 0;
    }
}

//TODO: getIndexOfNextPoint
//get the index to create another point in a box
function getNextPointsCounter(imgName,boxLabel){
    if(images[imgName].boxes && images[imgName].boxes[boxLabel].points){
        return images[imgName].boxes[boxLabel].points.length;
    }else{
        if(!images[imgName].boxes) {
            images[imgName].boxes = [];
            images[imgName].boxes[boxLabel] = { points : {}};
        }else if(!images[imgName].boxes[boxLabel]) {
            images[imgName].boxes[boxLabel] = { points : {}};
        }
        return 0;
    }
}



var drawRectangle = function(face_rectangle,gender){
	// change box color based on gender
	var rgbColor,
        rgbaColor;

    if (gender === 'Male') {
        rgbColor = '#12BDDC';
        rgbaColor = 'rgba(18,189,220,0.8)';
    } else {
        rgbColor = '#C537D8';
        rgbaColor = 'rgba(197,55,216,0.8)';
    }

    //var canvas = $('#canvas');
    //clearCanvas(canvas);

    $('<div/>').css({
        position: 'absolute',
        top: face_rectangle.top - 5,
        left: face_rectangle.left - 5,
        width: face_rectangle.width + 5,
        height: face_rectangle.height + 5,
        border: '3px solid ' + rgbColor,
        borderColor: rgbaColor,
        borderRadius: '10px'
    }).
    /*qtip({
        content: '<table>' +
                     '<tr><td>width</td><td>'        + (face.width * 0.01).toFixed(2) + '</td></tr>' +
                     '<tr><td>height</td><td>'       + (face.height * 0.01).toFixed(2) + '</td></tr>' +
                     '<tr><td>center</td><td>('      + (face.center.x      * 0.01).toFixed(2) + ', ' + (face.center.y      * 0.01).toFixed(2) + ')</td></tr>' +
                     '<tr><td>eye_left</td><td>('    + (face.eye_left.x    * 0.01).toFixed(2) + ', ' + (face.eye_left.y    * 0.01).toFixed(2) + ')</td></tr>' +
                     '<tr><td>eye_right</td><td>('   + (face.eye_right.x   * 0.01).toFixed(2) + ', ' + (face.eye_right.y   * 0.01).toFixed(2) + ')</td></tr>' +
                     '<tr><td>mouth_left</td><td>('  + (face.mouth_left.x  * 0.01).toFixed(2) + ', ' + (face.mouth_left.y  * 0.01).toFixed(2) + ')</td></tr>' +
                     '<tr><td>mouth_right</td><td>(' + (face.mouth_right.x * 0.01).toFixed(2) + ', ' + (face.mouth_right.y * 0.01).toFixed(2) + ')</td></tr>' +
                     '<tr><td>race</td><td>'         + face.attribute.race.value + ' (' + face.attribute.race.confidence.toFixed(2) + '%)</td></tr>' +
                     '<tr><td>age</td><td>'          + face.attribute.age.value + ' (&#177;' + face.attribute.age.range + ')</td></tr>' +
                     '<tr><td>gender</td><td>'       + face.attribute.gender.value + ' (' + face.attribute.gender.confidence.toFixed(2) + '%)</td></tr>' +
                 '</table>',
        style: {
            classes: 'detector-tooltip ui-tooltip-light ui-tooltip-tipify'
        },
        position: {
            my: 'bottom center',
            at: 'top center'
        }
    }).*/
    appendTo($("#img_home"));	
}

function generateLabelSelectionBox(){
    var elementStr = "<select class='form-control'>"
    labels.forEach(function(label,index){
        if(alteredData.faces[0].landmark[label]){
            elementStr += "<option disabled value='"+label+"'>"+index + " " + label+"</option>"    
        }else{
            elementStr += "<option value='"+label+"'>"+index + " " + label+"</option>"
        }
    });

    elementStr += "</select>";

    return elementStr;

}