
function saveAllBoxData(){
    /* if($('#img').attr("src")){
        var name = $('#img').attr('label');
        //rewrite all labeling information
        images[name].boxes = {}; 
        $('.facebox').each(function(box,i){
            return saveBoxData(this);
        });
    } */
}

//persist labelled data (box , feature points) in global variable
// so that the same data can be plotted when user move between images
function saveBoxData(el){
    if($('#img').attr("src")){
        var name = $('#img').attr('label');
        if(!images[name].boxes){ images[name].boxes = {}};
        var boxlbl = $(el).attr("label");
        if(!boxlbl || boxlbl === "") return -1;
        images[name].boxes[boxlbl] = { 
            left: $(el).position().left,
            top: $(el).position().top,
            width: $(el).width(),
            height: $(el).height()
        }

        images[name].boxes[boxlbl].points = []; // rewrite points data
        //persist points
        $(el).children().each(function(){
            var pointlbl = $(this).attr("label");
            if(!pointlbl || pointlbl === "") return -1;
            images[name].boxes[boxlbl].points[pointlbl] = {
                label: $(this).attr("label"),
                x: $(this).position().left,
                y: $(this).position().top,
            }
        });
    }
}

//add or update label box
function updateLabelBox(box_el){
    var imgName = $('#img').attr("label");
    var boxlbl = $(box_el).attr("label");
    if(!boxlbl || boxlbl === "") {
        throw Error("All the label boxes must be labelled");
    }else{
        if(!images[imgName]){
            images[imgName] = {}
            images[imgName].boxes = {}
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

//add or update a feature point
function updateFeaturePoint(imgName,box_el,point_el){
    console.log(arguments)
    var boxlbl = $(box_el).attr("label");
    var pointlbl = $(point_el).attr("label");
    if(!pointlbl || pointlbl === ""){
        throw Error("All the feature points must be labelled");
    }else{
        images[imgName].boxes[boxlbl].points[pointlbl] = {
            label: $(point_el).attr("label"),
            x: $(point_el).position().left,
            y: $(point_el).position().top,
        }
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
        //TODO: update point information in global object
        //displayPointWidget($(e.el));
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

