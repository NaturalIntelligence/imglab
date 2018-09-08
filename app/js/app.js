function showSnackBar(msg) {
    // Get the snackbar DIV
    $("#snackbar").text(msg);
    $("#snackbar").addClass("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        $("#snackbar").removeClass("show");
        $("#snackbar").text("");
    }, 3000);
}

//get mouse cordinates on image
function getCordinates(event, element) {
    var rect = element[0].getBoundingClientRect();
    var x = event.pageX - rect.left;
    var y = event.pageY - rect.top;
    return {
        x: x,
        y: y
    };
}

/**
 * Search an item in array based on id property.
 * returns index of the item
 * @param {Array} arr 
 * @param {string} itemId 
 */
function indexOf(arr, property, val){
    for(var i=0; i<arr.length; i++){
        if(arr[i][property] === val) return i;
    }

    return -1;//if not found
}

/**
 * Search an item in array based on given property
 * @param {Array} arr 
 * @param {string} itemId 
 */
function findInArray(arr, property, val){
    for(var i=0; i<arr.length; i++){
        if(arr[i][property] === val) return arr[i];
    }
}


function pDistance( x1, y1, x2, y2, x, y) {

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    var xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }