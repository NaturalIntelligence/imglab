
function saveAllBoxData(){
    if($('#img').attr("src")){
        var name = $('#img').attr('label');
        images[name].boxes = []; //rewrite all the data
        $('.facebox').each(function(box,i){
            return saveBoxData(this);
        });
    }
}


function saveBoxData(el){
    if($('#img').attr("src")){
        var name = $('#img').attr('label');
        if(!images[name].boxes){ images[name].boxes = []};
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
                x: $(this).position().left,
                y: $(this).position().top,
            }
        });
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
    }/*,
    stop: function(e){
        displayPointWidget($(e.el));
    }*/
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
    }/*,
    stop: function(e){
         displayBoxWidget($(e.el));
    }*/
  });
}

/* Save data to a file */
function download(data, filename, type) {
    var blobData = new Blob([data], {type: type + ";charset=utf-8"})
    saveAs(blobData, filename);
}

