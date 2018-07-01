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
 * Search an item in array based on id property
 * @param {Array} arr 
 * @param {string} itemId 
 */
function indexOf(arr, itemId){
    for(var i=0; i<arr.length; i++){
        if(arr[i].id === itemId) return i;
    }
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