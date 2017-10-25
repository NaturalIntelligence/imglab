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

function confirm(cordinates){
    $.confirm({
        content: 'Please select the label <br>' + generateLabelSelectionBox(),
        type: 'green',
        buttons: {   
            ok: {
                text: "ok!",
                btnClass: 'btn-primary',
                action: function(){
                     var lbl= this.$content.find('select').val();
                     drawPoint(0,cordinates,labels.indexOf(lbl));
                }
            },
            cancel: function(){
                    console.log('the user clicked cancel');
            }
        }
    });
}

function generateLabelSelectionBox(){
    var elementStr = "<select>"
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