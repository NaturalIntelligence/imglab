  document.addEventListener('keydown', e=>{

    if (e.key == '≠') {//Zoom in
        $("#tool-zoom").click();
        $("[data-zoom-type='in']").zoom();
        e.preventDefault();
        e.stopPropagation();
     }
    
     if (e.key == '–') {//Zoom out
        $("#tool-zoom").click();
        $("[data-zoom-type='out']").zoom();
        e.preventDefault();
        e.stopPropagation();
     }
});

