
//add or update label box
function updateLabelBox(box_el){
    var imgName = $('#img').attr("label");
    var boxlbl = $(box_el).attr("label");
    if(!boxlbl || boxlbl === "") {
        throw Error("All the label boxes must be labelled");
    }else{
        if(!images[imgName]){
            images[imgName] = {
                boxes : {}
            }
        }
        images[imgName].boxes[boxlbl] = { 
            left: $(box_el).position().left,
            top: $(box_el).position().top,
            width: $(box_el).width(),
            height: $(box_el).height()
        }
    }
}

function deleteLabelBox(box_el){
    var imgName = $('#img').attr("label");
    var boxlbl = $(box_el).attr("label");

    delete images[imgName].boxes[boxlbl] ;
}


function updateLabelBoxLabel(oldLabel,newLabel){
    var imgName = $('#img').attr("label");
    if(!images[imgName] || !images[imgName].boxes || !images[imgName].boxes[oldLabel]){
        console.log("Label box is not created yet");
    }else{
        images[imgName].boxes[newLabel] = images[imgName].boxes[oldLabel] ;
        delete images[imgName].boxes[oldLabel] ;
    }
}

function deleteLabelBoxPoints(box_el){
    var imgName = $('#img').attr("label");
    var boxlbl = $(box_el).attr("label");
    images[imgName].boxes[boxlbl].points = {} ;
}

function deleteLabels(){
    var imgName = $('#img').attr("label");
    images[imgName].boxes = {} ;
}

//add or update a feature point
function updateFeaturePoint(point_el){
    var imgName = $('#img').attr("label");
    var boxlbl = $(point_el).parent().attr("label");
    var pointlbl = $(point_el).attr("label");
    if(!pointlbl || pointlbl === ""){
        throw Error("All the feature points must be labelled");
    }else{
        //Considering that label box has already been created
        if(! images[imgName].boxes[boxlbl].points){
            images[imgName].boxes[boxlbl].points = {}
        }
        images[imgName].boxes[boxlbl].points[pointlbl] = {
            label: $(point_el).attr("label"),
            x: $(point_el).position().left,
            y: $(point_el).position().top,
        }
    }
}

function deleteFeaturePoint(point_el){
    var imgName = $('#img').attr("label");
    var boxlbl = $(point_el).parent().attr("label");
    var pointlbl = $(point_el).attr("label");

    delete images[imgName].boxes[boxlbl].points[pointlbl] ;
}

function updateFeaturePointLabel(point_el,oldLabel,newLabel){
    var imgName = $('#img').attr("label");
    var boxLabel = $(point_el).parent().attr("label");
    if(!images[imgName] || !images[imgName].boxes || !images[imgName].boxes[boxLabel]
        || !images[imgName].boxes[boxLabel].points || !images[imgName].boxes[boxLabel].points[oldLabel]){
        console.log("Feature point is not created yet");
    }else{
        images[imgName].boxes[boxLabel].points[newLabel] = images[imgName].boxes[boxLabel].points[oldLabel] ;
        delete images[imgName].boxes[boxLabel].points[oldLabel] ;
    }
}

function drawAllBoxData(boxes){
    if(boxes){
        for (var boxlbl in boxes) {
            if (boxes.hasOwnProperty(boxlbl)) {
                var tmpBox = appendBox({
                    top: boxes[boxlbl].top,
                    left: boxes[boxlbl].left,
                    width: boxes[boxlbl].width,
                    height: boxes[boxlbl].height
                });
                tmpBox.attr("label", boxlbl);
                
                // Add points
                var points = boxes[boxlbl].points;
                for (var pointlbl in points) {
                    if (points.hasOwnProperty(pointlbl)) {
                        drawPoint(points[pointlbl],tmpBox,pointlbl);
                    }
                }
            }
        }
    }
}

function drawPoint(coordinates,el,lbl){
  var point = $('<div class="ptn"></div>')
            .css('top', coordinates.y + 'px')
            .css('left', coordinates.x + 'px')
            .appendTo(el);
  if(!lbl){
    lbl = $(el).find(".ptn").length;
  }
  point.attr("label" ,lbl);
  jsPlumb.draggable(point,{
    drag: function(e){
        displayPointWidget($(e.el));
    },
    stop: function(e){
        updateFeaturePoint(e.el);
    }
  });

  return point;
}

/*Add box on the image*/
function appendBox(css){
    var tmpBox =  $("<div class='facebox'></div>")
            .css(css)
            .appendTo($("#img_overlay"));
    makeItDraggable(tmpBox);
    return tmpBox;
}

/* make a box dragabble*/
function makeItDraggable(el){
  jsPlumb.draggable(el,{
    start: function(e){
        select(el);
    },
    drag: function(e){
        displayBoxWidget($(e.el));
    },
    stop: function(e){
        updateLabelBox(e.el);
        //displayBoxWidget($(e.el));
    }
  });
}

/* Save given data to a file */
function download(data, filename, type) {
    var blobData = new Blob([data], {type: type + ";charset=utf-8"})
    saveAs(blobData, filename);
}

