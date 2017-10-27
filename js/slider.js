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
    currentImg = images[$(this).attr('label')];
    $('#img').attr('src', currentImg.data)
    $('#img').attr('label', $(this).attr('label'))
});