  document.addEventListener('keydown', e=>{
    if (e.key == '≠') {//Zoom in
        $("#tool-zoom").click();
        $("img[data-zoom-type='in']").click();
        e.preventDefault();
        e.stopPropagation();
     }
    
     if (e.key == '–' && e.altKey) {//Zoom out
        $("#tool-zoom").click();
        $("img[data-zoom-type='out']").click();
        e.preventDefault();
        e.stopPropagation();
     }
});