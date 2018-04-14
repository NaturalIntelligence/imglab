
/* Save given data to a file */
function download(data, filename, type) {
    var blobData = new Blob([data], {type: type + ";charset=utf-8"})
    saveAs(blobData, filename);
}


/* Load selected images or images fom a folder in slider*/
function readImageFiles(input) {
    if (input.files && input.files[0]) {
        emptySlider();
        hideWidgets();
        emptyCanvas();
        //imagesData = {};
        for(i=0;i<input.files.length;i++){
            readImageFile(input.files[i]);
        }
    }
}

/*read an image file and add to slider*/
function readImageFile(f){
    if(f.type.startsWith("image")){
        var reader = new FileReader();
        reader.onload = function (e) {
            var imgData = {
                name : f.name,
                data: e.target.result
            };
            imagesData[f.name] = imgData
            addToSlider(imgData);
        }
        reader.readAsDataURL(f);
    }
}

function readPointsFile(input) {
    if (input.files && input.files[0]) {
        var pointFile = input.files[0];
        emptyCanvas();
        deselectAll();
        var reader = new FileReader();
        reader.onload = function (e) {
            if(pointFile.name.endsWith(".pts")){
                loadPts(e.target.result);
            }else if(pointFile.name.endsWith(".json")){
                loadJson(e.target.result);
            }else if(pointFile.name.endsWith(".fpp")){
                loadFpp(e.target.result);
            }else{
                console.log("Not supported");
            }
        };

        reader.readAsText(input.files[0]);
    }
}
