//As the box size and position is unknown (though can be calculated) not supporting pts file.
/* var loadPts = function(data){
    $dialog({
        title: '',
        content: "<p>Pts file contains point detail of single box without label. So it'll be applied on currently open image.</p>"
        + "<p>If you load same pts file multiple times. It'll add new points everytime</p>"
    });
    if($('#img').attr('src')){

    }
} */

//load data used by this application
var loadJson = function(data){
    emptyCanvas();
    deselectAll();
    images = JSON.parse(data);
}

var loadFpp = function(data){

}

//load xml data used by dlib library and transform to obj used with this application
var loadXml = function(data){
    var obj = parser.parse(data,{
        ignoreAttributes : false,
        attributeNamePrefix : "",
    });

    if(!images) images = {};

    for(var index=0; index < obj.dataset.images.image.length; index++){//for each image
        var pathArr = obj.dataset.images.image[index].file.split(/\\|\//);
        var imgName = pathArr[pathArr.length -1];
        var box = obj.dataset.images.image[index].box;
        if(box){
            if(!Array.isArray(box)){
                box = [box];
            }
            var boxObject = {};
            for(var b_index =0; b_index < box.length; b_index++){//for each box
                var currentBox = box[b_index];
                var boxlabel = currentBox.label || b_index+1;

                boxObject[boxlabel] = {
                    left: currentBox.left,
                    top: currentBox.top,
                    height: currentBox.height,
                    width: currentBox.width,
                    ignore: currentBox.ignore
                    /* pose='4' detection_score='4' */
                }
                if(currentBox.part){
                    if(!Array.isArray(currentBox.part)){
                        currentBox.part = [currentBox.part];
                    }
                    boxObject[boxlabel].points = {};

                    for(var p_index=0; p_index< currentBox.part.length; p_index++){//for each part
                        var pointlabel = currentBox.part[p_index].name || p_index+1;

                        boxObject[boxlabel].points[pointlabel] = {
                            x: currentBox.part[p_index].x - currentBox.left,
                            y: currentBox.part[p_index].y - currentBox.top,
                        }
                    }//End - for each part
                }
            }//End - for each box
        }

        images[imgName] = {
            boxes : boxObject
        }
    }//End - for each image

}

