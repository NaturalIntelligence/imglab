function selectFileTypeToSave(){
    $.dialog({
        title: 'Save/Export as',
        content: `<div style="text-align:center;">
                    <div>
                        <button class="btn btn-primary savebtn"  onclick="javascript:saveAsNimn()" id="saveAsNimn">Project file</button>
                    </div>
                    <div>
                        <button class="btn btn-primary savebtn" onclick="javascript:saveAsDlibXML()" id="saveAsNimn">Dlib XML</button>
                    </div>
                    <div>
                        <button class="btn btn-primary savebtn" onclick="javascript:saveAsDlibPts()" id="saveAsNimn">Dlib pts</button>
                    </div>
                    <div>
                        <button class="btn btn-primary savebtn" onclick="javascript:saveAsCOCO()" id="saveAsCOCO">COCO JSON</button>
                    </div>
                    <div>
                        <button class="btn btn-primary savebtn" onclick="javascript:saveAsPascalVOC()" id="saveAsPascalVOC">Pascal VOC XML</button>
                    </div>
                    <div>
                        <button class="btn btn-primary savebtn" onclick="javascript:saveAsYoloV5Pytorch()" id="saveAsYoloV5Pytorch">YOLO V5 Pytorch</button>
                    </div>
                <div>`,
        escapeKey: true,
        backgroundDismiss: true,
    });
}

/**
 * Save project file in Nimn format
 */
function saveAsNimn(){
    askFileName("Untitled_imglab.nimn", function(fileName){
        analytics_reportExportType("nimn");
        report_UniqueCategories();
        download( nimn.stringify(nimnSchema, labellingData), fileName, "application/nimn");
        //download( JSON.stringify(labellingData), fileName, "application/json");
    });
}

function report_UniqueCategories(){
    var imgNames = Object.keys(labellingData);
    var setData = new Set();
    for(var i=0; i< imgNames.length; i++){
        var image = labellingData[ imgNames[i] ];
        for(var shape_i=0; shape_i < image.shapes.length; shape_i++){
            setData.add( (image.shapes[ shape_i ].category || 'X') + "|" + (image.shapes[ shape_i ].label || 'X') );
        }
    }

    try{
        setData.forEach(labelData => {
            var reportData = labelData.split(/\|(.+)/);

            gtag('event', 'label', {
                'event_category': reportData[0], //Human
                'event_label': reportData[1], //Face
                'value' : 1
            });
        });

    }catch(e){

    }
}

/**
 * Save labelled data as DLIB supported XML file. It captures only boundary box detail.
 */
function saveAsDlibXML(){
    var dlibXMLData = toDlibXML(labellingData);
    askFileName(Object.keys(labellingData).length + "_imglab.xml", function(fileName){
        analytics_reportExportType("dlib_xml");
        download(dlibXMLData, fileName, "text/xml", "iso-8859-1");
    });
}

/**
 * Save feature point detail of selected label as DLIB supported point file (pts).
 */
function saveAsDlibPts(){
    var ptsData,shape;
    if(!imgSelected){
        showSnackBar("This option is applicable on the image loaded in workarea.");
        return;
    }else if(selectedElements.length === 1){
        //TODO: bug element gets unselected when select any tool
        shape  = getShape(selectedElements[0].id);
    }else if(labellingData[imgSelected.name].shapes.length === 1){
        shape  = labellingData[imgSelected.name].shapes[ 0 ];
    }else{
        showSnackBar("Please create or select one shape.");
        return;
    }

    ptsData = toDlibPts( shape );
    askFileName(imgSelected.name + "_imglab.pts", function(fileName){
        analytics_reportExportType("dlib_pts", shape.featurePoints.length );
        download(ptsData, fileName, "text/plain");
    });
}

/**
 * Save labelled data as COCO supported JSON file. 
 * It captures only boundary box detail and categories.
 */
function saveAsCOCO(){
    var cocoData = cocoFormater.toCOCO(labellingData);
    askFileName(Object.keys(labellingData).length + "_coco_imglab.json", function(fileName){
        analytics_reportExportType("coco");
        download(JSON.stringify(cocoData), fileName, "application/json", "utf-8");
    });
}

/**
 * Save labelled data as Pascal VOC supported XML file. 
 * It captures only boundary box detail of currently loaded/selected image.
 */
function saveAsPascalVOC(){

    if(!imgSelected){
        showSnackBar("This option is applicable on the image loaded in workarea.");
        return;
    }else if(labellingData[ imgSelected.name ].shapes.length === 0){
        showSnackBar("You need to label the currently loaded image.");
        return;
    }else{
        var data = pascalVocFormater.toPascalVOC();
        askFileName(Object.keys(labellingData[ imgSelected.name ].shapes.length ).length + "_pvoc_imglab.xml", function(fileName){
            analytics_reportExportType("pascal_voc");
            download(data, fileName, "text/xml", "utf-8");
        });
    }

}

/**
 * Save labelled data as YOLO supported TXT Files file.
 * It will export files in a zip format
 */

 function saveAsYoloV5Pytorch() {
    // COUNT TOTAL MASKED IMAGES
    var totalLabbeledImages = 0;
    for (const key in labellingData) {
        if(labellingData[key].shapes[0] && labellingData[key].shapes[0].points.length > 0){
            totalLabbeledImages++;
        }
    }

    // MODAL FOR RECEIVING DATA SPLIT INPUTS
    $.dialog({
        title: `Split ${totalLabbeledImages} Labeled Images into :`,
        content: `<div class="col w-75 m-auto">
                    <div class="row">
                        <div ref="label-data" class="col"> Train </div>
                        <div ref="label-data" class="col"> Test </div>
                        <div ref="label-data" class="col"> Valid </div>
                    </div>
                    <div class="row justify-content-between">
                        <input type="text" class="col" value="${Math.floor(totalLabbeledImages/100*70)}" onchange="javascript:validateImageSplit()" style="width: 20px;" placeholder=""> 
                        <input type="text" class="col" value="${Math.floor(totalLabbeledImages/100*30)}" onchange="javascript:validateImageSplit()" style="width: 20px;" placeholder=""> 
                        <input type="text" class="col" value="${Math.floor(totalLabbeledImages/100*10)}" onchange="javascript:validateImageSplit()" style="width: 20px;" placeholder=""> 
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <span class="mt-2 w-75" id="splitMsg" > </span> 
                </div>
                <div class="d-flex" style="text-align:center;">
                    <button class="btn btn-primary savebtn" onclick="javascript:yoloDataRendering()">Generate</button>
                </div>`,
        escapeKey: true,
        backgroundDismiss: true,
    });
}

function validateImageSplit(){
    // COLLECTING USER INPUT VALUES
    const valueElements = document.querySelectorAll('[style="width: 20px;"]');
    const trainImages = parseInt(valueElements[0].value);
    const testImages = parseInt(valueElements[1].value);
    const validImages = parseInt(valueElements[2].value);
    
    var totalLabbeledImages = 0;
    for (const key in labellingData) {
        if(labellingData[key].shapes[0] && labellingData[key].shapes[0].points.length > 0){
            totalLabbeledImages++;
        }
    }

    var remainingImages = totalLabbeledImages -trainImages -testImages -validImages;
    if(remainingImages > 0){
        document.getElementById('splitMsg').innerText = `${remainingImages} Labelled Images remaining to split.`; 
    }

    if(trainImages + testImages + validImages == totalLabbeledImages){
        document.getElementById('splitMsg').innerText = ""; 
        return [trainImages, testImages, validImages, true];
    }else{
        showSnackBar(`Total of ( Train+Test+Valid ) must be ${totalLabbeledImages}.`);
        return [0, 0, 0, false];
    }
}

function yoloDataRendering() {
  var [train, test, valid, isValuesValid] = validateImageSplit();

  // CHECK FOR VALID INPUTS
  if (!isValuesValid) return;

  // COLLECT AND SAVE UNIQUE LABELS
  const labels = new Set();
  for (const image in labellingData) {
    const img = labellingData[image];
    img.shapes.forEach((shape) => {
      labels.add(shape.label);
    });
  }

  const zip = new JSZip();
  const finalLabels = [...labels];

  var trainImgLimit = train;
  var testImgLimit = train + test;
  var validImgLimit = testImgLimit + valid;
  var currImage = 0;

  // CREATE DATA.YAML FILE
  const dataYamlFile = `train: ../train/images\nval: ../valid/images\ntest: ../test/images\n\nnc: ${finalLabels.length}\nnames: ['${finalLabels.join("','")}']`;
  zip.file("data.yaml", dataYamlFile);

  //   GENERATE YOLO REQUIRED FORMAT DATA
  for (const image in labellingData) {
    let outputArr = [];
    let fileName = image.substring(0, image.lastIndexOf(".")) + ".txt";

    // RECONSTRUCT IMAGES
    let base64Image = document.querySelector(`[label="${image}"]`).src;
    var byteCharacters = atob(base64Image.split(",")[1]);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: "image/jpg" }); // Specify the appropriate MIME type

    // ITRATE THROUGH EACH SHAPE
    labellingData[image].shapes.forEach((shape) => {
      let currArr = [];
      currArr.push(finalLabels.indexOf(shape.label));

      //   CALCULATE POINTS
      if (shape.points[0][0]) {
        let coordinates = shape.points;
        coordinates.forEach((point) => {
          let xNorm = point[0] / labellingData[image].size.width;
          let yNorm = point[1] / labellingData[image].size.height;
          currArr.push(xNorm, yNorm);
        });
      } else {
        let [xMin, yMin, w, h] = shape.points;
        const yoloXCenter = (xMin + w / 2) / labellingData[image].size.width;
        const yoloYCenter = (yMin + h / 2) / labellingData[image].size.height;
        const yoloBoxWidth = w / labellingData[image].size.width;
        const yoloBoxHeight = h / labellingData[image].size.height;
        currArr.push(yoloXCenter, yoloYCenter, yoloBoxWidth, yoloBoxHeight);
      }
      outputArr.push(currArr.join(" "));
    });

    // ADD FILES TO ZIP IF LABELLED
    if (outputArr.length > 0) {
      if (currImage < trainImgLimit) {
        saveDirectory = "train";
      } else if (currImage < testImgLimit) {
        saveDirectory = "test";
      } else if (currImage <= validImgLimit) {
        saveDirectory = "valid";
      }
      currImage++;

      zip.file(`${saveDirectory}/images/${image}`, blob);
      zip.file(`${saveDirectory}/labels/${fileName}`, outputArr.join("\n"));
    }
  }

  // SET FILE NAME
  var curTimeStamp = new Date();
  var timeStamp = `${curTimeStamp.getDate()}/ ${curTimeStamp.getMonth() + 1}/ ${curTimeStamp.getFullYear()}/
      ${curTimeStamp.getHours()}: ${curTimeStamp.getMinutes()}: ${curTimeStamp.getSeconds()}`;

  // CREATE ZIP AND SAVE
  zip.generateAsync({ type: "blob" })
     .then(function (content) {
       saveAs(content, timeStamp + ".zip");
       showSnackBar(`File will be downloaded automatically`);
       analytics_reportExportType("yoloV5PyTorch");
     })
     .catch(function (error) {
       showSnackBar("Error occoured while creating ZIP file");
       console.error("Error creating ZIP file:", error);
     });
}

/**
 * Save given data to a file
 * @param {*} data 
 * @param {string} filename 
 * @param {string} type : Mime type
 */
function download(data, filename, type, encoding) {
    encoding || (encoding = "utf-8")
    var blobData = new Blob([data], {type: type + ";charset="+encoding})
    saveAs(blobData, filename);
}

/**
 * Ask user to provide output filename
 * @param {string} suggestedName 
 * @param {function} cb 
 */
function askFileName(suggestedName, cb){
    suggestedName || (suggestedName = "Untitled_imgLab" )
    $.confirm({
        title: 'File Name',
        content: `<input class="form-control"  type"text" id="fileName" value="${suggestedName}" >`,
        buttons: {
            confirm: {
                text: 'Save',
                btnClass: 'btn-blue',
                action: function () {
                    var fname = this.$content.find('#fileName').val();
                    if(!fname){
                        $.alert('provide a valid name');
                        return false;
                    }
                    cb(fname);
                }
            },
            cancel: function () {
                //close
            },
        }//buttons
    })
}

function analytics_reportExportType(type, len){
    try{
        gtag('event', 'save_as', {
            'event_category': type,
            'event_label': len || Object.keys(labellingData).length,
            'value' : 1
        });
    }catch(e){

    }

}