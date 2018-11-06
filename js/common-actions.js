  document.addEventListener('keydown', e=>{

    if (e.key == '≠') {//Zoom in
        $("#tool-zoom").click();
        $("[data-zoom-type='in']").click();
        console.log('test');
        e.preventDefault();
        e.stopPropagation();
     }
    
     if (e.key == '–') {//Zoom out
        $("#tool-zoom").click();
        $("[data-zoom-type='out']").click();
        e.preventDefault();
        e.stopPropagation();
     }
});

