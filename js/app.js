function showSnackBar(msg) {
    // Get the snackbar DIV
    $("#snackbar").text(msg);
    $("#snackbar").addClass("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ $("#snackbar").removeClass("show"); $("#snackbar").text("");}, 3000);
}