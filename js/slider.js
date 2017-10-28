function populateSlider(imgs){
    var photolist = $('.photolist');

    var thumbnails = [];
    for (var i = 0, len = imgs.length; i < len; i++) {
        var img = document.createElement('img');
        img.src = imgs[i].data;
        img.width = img.height = 80;
        thumbnails.push(img);
    }
    photolist.append(thumbnails);
}


function addToSlider(imgData){
    var photolist = $('.photolist');

    var thumbnails = [];
    var img = document.createElement('img');
    img.src = imgData.data;
    //set an extra attribute reference to main images array
    var label = document.createAttribute("label"); 
    label.value = imgData.name;
    img.setAttributeNode(label);
    img.title = imgData.name;
    img.width = img.height = 80;
    thumbnails.push(img);
    photolist.append(thumbnails);
}

var sliding = false;
var sliderMove = "80px";
$('.left-paddle').click(function() {
    var photolist = $('.photolist');
    if (sliding === false) {
        sliding = true;
        photolist.css({ left: "-"+sliderMove })
            .prepend(photolist.children('img:last-child'))
            .animate({ left: 0 }, 200, 'linear', function() {
                sliding = false;
            });
    }
});
$('.right-paddle').click(function() {
    var photolist = $('.photolist');
    if (sliding === false) {
        sliding = true;
        photolist.animate({ left: "-"+sliderMove }, 200, 'linear', function() {
            photolist.css({ left: 0 })
                .append(photolist.children('img:first-child'));
            sliding = false;
        });
    }
});


function emptySlider(){
    $('.photolist').empty();
}


$(document).on('click', '.photolist img', function(ev){
    saveAllBoxData();
    var currentImg = images[$(this).attr('label')];
    $('#img').attr('src', currentImg.data)
    $('#img').attr('label', $(this).attr('label'))
    
});

function saveAllBoxData(){
    if($('#img').attr("src")){
        var name = $('#img').attr('label');
        images[name].boxes = []; //rewrite all the data
        $('.facebox').each(function(box,i){
            saveBoxData(this);
        });
    }
}


function saveBoxData(el){
    if($('#img').attr("src")){
        var name = $('#img').attr('label');
        if(!images[name].boxes){ images[name].boxes = []};
        var boxlbl = $(el).attr("label");
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
