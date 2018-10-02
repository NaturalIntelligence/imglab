/************* Select,Deselect an element and show corresponding widget */
function deselectAll(){
    $("#boxDtl, #ptnDtl").hide();
    $(".selected").removeClass("selected");
}

function select(el){
    deselectAll();
    $(el).addClass("selected");
    if($(el).hasClass("facebox")){
        displayBoxWidget(el)
    }else{
        displayPointWidget(el)
    }
}

function deselect(el){
    $(el).removeClass("selected");
    if($(el).hasClass("facebox")){
        $("#boxDtl").hide();
    }else{
        $("#ptnDtl").hide();
    }
}

function toggleSelect(el){
    if($(el).hasClass("selected")){
        deselect(el);
    }else{
        select(el);
    }

}

function displayBoxWidget(el){
    var lbl = $(el).attr("label");
    $("#boxtxtbox").val( lbl || "");
    $("#div_l").text(el.position().left);
    $("#div_t").text(el.position().top);
    $("#div_w").text(el.width());
    $("#div_h").text(el.height());
    $("#boxDtl").show();
}

function displayPointWidget(el){
    $("#lbltxtbox").val($(".ptn.selected").attr("label"));
    $("#div_x").text($(el).position().left);
    $("#div_y").text($(el).position().top);
    $("#ptnboxlbl").val($(".ptn.selected").parent().attr("label"));
    $("#ptnDtl").show();
}

function hideWidgets(){
    $(".widget").hide();
}
/*************End: Select,Deselect an element and show corresponding widget */