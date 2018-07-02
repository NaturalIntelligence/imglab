function selectFileTypeToSave(){
    $.dialog({
        title: 'Save/Export as',
        content: `<div style="text-align:center;">
                <div>
                    <button class="btn btn-primary savebtn"  onclick="javascript:saveAsNimn()" id="saveAsNimn">Save project file</button>
                </div>
                <div>
                    <button class="btn btn-primary savebtn" onclick="javascript:saveAsDlibXML()" id="saveAsNimn">Export Dlib XML</button>
                </div>
                <div>
                    <button class="btn btn-primary savebtn" onclick="javascript:saveAsDlibPts()" id="saveAsNimn">Export Dlib pts</button>
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
    //TODO : change it after change in nimnjs
    askFileName("Untitled_imglab.nimn", function(fileName){

        download( nimn.stringify(nimnSchema, labellingData), fileName, "application/nimn");
        //download( JSON.stringify(labellingData), fileName, "application/json");
    });
}

/**
 * Save labelled data as DLIB supported XML file. It captures only boundary box detail.
 */
function saveAsDlibXML(){
    var dlibXMLData = toDlibXML(labellingData);
    askFileName(Object.keys(labellingData).length + "_imglab.xml", function(fileName){
        download(dlibXMLData, fileName, "text/xml");
    });
}

/**
 * Save feature point detail of selected label as DLIB supported point file (pts).
 */
function saveAsDlibPts(){
    var ptsData;
    if(!imgSelected){
        showSnackBar("This option is applicable on the image loaded in workarea.");
        return;
    }else if(selectedElements.length === 1){
        //TODO: bug element gets unselected when select any tool
        getShape(selectedElements[0].id)
        ptsData = toDlibPts( getShape(selectedElements[0].id) );
    }else if(labellingData[imgSelected.name].shapes.length === 1){
        ptsData = toDlibPts( labellingData[imgSelected.name].shapes[ 0 ] );
    }else{
        showSnackBar("Please create or select one shape.");
        return;
    }

    askFileName(imgSelected.name + "_imglab.pts", function(fileName){
        download(ptsData, fileName, "text/plain");
    });
}

/**
 * Save given data to a file
 * @param {*} data 
 * @param {string} filename 
 * @param {string} type : Mime type
 */
function download(data, filename, type) {
    var blobData = new Blob([data], {type: type + ";charset=utf-8"})
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