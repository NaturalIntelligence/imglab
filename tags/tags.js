riot.tag2('actionbar', '<div id="actionbar"> </div>', 'actionbar #actionbar,[data-is="actionbar"] #actionbar{ height: 40px; width: 100%; border: 1px solid grey; }', '', function(opts) {
});
riot.tag2('facepp', '<input onchange="{saveKey}" class="form-control" type="text" name="api_key" id="fpp_api_key" placeholder="api_key" riot-value="{pluginsStore.facepp.key}"> <input onchange="{saveSecret}" class="form-control" type="text" name="api_secret" id="fpp_api_secret" placeholder="api_secret" riot-value="{pluginsStore.facepp.secret}"> <br> <input onclick="{fetchFpp}" class="btn fppBtn" type="button" name="faceppBtn" id="faceppBtn" value="Plot with Face++">', 'facepp .fppBtn,[data-is="facepp"] .fppBtn{ background: #17a2b8; width: 100%;color: white; }', '', function(opts) {
        this.saveKey = function(e){
            pluginsStore.facepp.key = e.target.value;
        }

        this.saveSecret = function(e){
            pluginsStore.facepp.secret = e.target.value;
        }

        this.fetchFpp = function(){
            if(!imgSelected.src || !pluginsStore.facepp.key || !pluginsStore.facepp.key){
                showSnackBar("You need to load an image in workarea and input Face++ credential above .");
            }else{
                fetchFromFpp(prepareFormData(null,imgSelected.src) , function(data){
                    fppToImgLabObject(data);
                    riot.mount('workarea');
                });
            }

        }

        function prepareFormData(url,imgdata){
            var formData = new FormData();

            formData.append('api_key', pluginsStore.facepp.key );
            formData.append('api_secret', pluginsStore.facepp.secret );
            formData.append('return_landmark', 1);

            formData.append('return_attributes', "gender,age,headpose");
            if(url){
                console.log(url)
                formData.append('image_url', url);
            }else{

                formData.append('image_base64', imgdata.substr( imgdata.indexOf(";base64,")+8));
            }

            return formData;
        }

        function fetchFromFpp(formData, fn){
            $.ajax({
                url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                success: fn,
                error: function(err) {
                    $("#info").text("Error in connecting face++ API. Check console for more deetail");
                    console.error("Error in connecting face++ API", err);
                }
            });
        }

        function fppToImgLabObject(fppResponse){
            var imgName = imgSelected.name;

            for(var face_i in fppResponse.faces){
                var face = fppResponse.faces[ face_i ];
                var faceLable = "fppface" + face_i;
                labellingData[ imgName ].shapes[ faceLable ] = {
                    label: faceLable,
                    type: "rect",
                    bbox : {
                        x : face.face_rectangle.left,
                        y : face.face_rectangle.top,
                        w : face.face_rectangle.width,
                        h : face.face_rectangle.height,
                    },
                    points : [
                        face.face_rectangle.left,
                        face.face_rectangle.top,
                        face.face_rectangle.width,
                        face.face_rectangle.height
                    ],
                    angle: [
                        face.attributes.headpose.roll_angle,
                        face.attributes.headpose.yaw_angle,
                        face.attributes.headpose.pitch_angle
                    ],
                    attributes : [],
                    featurePoints: {}
                };

                var attributes = Object.keys(face.attributes);
                for(var a_i in attributes){
                    var attribute = face.attributes[ attributes[ a_i ] ];
                    if(attribute.value){
                        labellingData[ imgName ]
                            .shapes[ faceLable ]
                                .attributes[ attributes[ a_i ] ] = attribute.value;
                    }
                }

                var fPoints = labellingData[ imgName ].shapes[ faceLable ].featurePoints;

                var fPointLabels = Object.keys(face.landmark);
                for(var fPoint_i =0; fPoint_i < fPointLabels.length; fPoint_i++){
                    var label = fPointLabels [fPoint_i];
                    fPoints [ label ] = {
                        x : face.landmark [ label ].x,
                        y : face.landmark [ label ].y,
                        label: label
                    }
                }
            }
        }
});
riot.tag2('images-slider', '<div class="float-left" style="width: 50px; height: 100%; text-align: center; padding: 10px; border-left: 1px solid grey;"> <label class="btn-bs-file"> <img class="file-input-icon" src="img/icons/files-white.png"> <input type="file" class="filebutton" accept="image/*" onchange="{readImageFiles}" multiple> </label> <label class="btn-bs-file"> <img class="file-input-icon" src="img/icons/open.png"> <input type="file" id="image_folder" webkitdirectory mozdirectory msdirectory odirectory directory onchange="readImageFiles(this)"> </label> </div> <div class="float-left left-paddle " style="width: 50px; height: 100%;" onclick="{slideleft}"></div> <div class="float-left photolist-wrapper " style="width: calc(100% - 160px); height: 100%;"> <div name="photolist" class="photolist"> <img each="{this.thumbnails}" riot-src="{src}" label="{name}" title="{name}" width="{this.thumbnailWidth}" onclick="{loadIntoWorkArea}"> </div> </div> <div class="right-paddle" style="width: 50px; height: 100%;" onclick="{slideright}"></div>', '', '', function(opts) {
        tag = this;
        tag.readImageFiles = readImageFiles;
        tag.readImageFile = readImageFile;
        tag.slideleft = slideleft;
        tag.slideright = slideright;
        tag.deleteThumbnail = deleteThumbnail;
        tag.loadIntoWorkArea = loadIntoWorkArea;

        function readImageFiles(e) {
            var input = e.srcElement;
            if (input.files && input.files[0]) {
                for(i=0;i<input.files.length;i++){
                    this.readImageFile(input.files[i]);
                }
            }
        }
        this.thumbnails = [];
        this.thumbnailWidth= this.opts.thumbnail_width || "80px"
        function readImageFile(f) {
            if(f.type.startsWith("image")){
                var reader = new FileReader();
                reader.onload = e => {
                    var imgData = {
                        name : f.name,
                        src: e.target.result
                    };
                    updateDimentions(e.target.result,imgData);
                    this.thumbnails.push(imgData);

                    this.trigger("uploadimages");
                }
                reader.onloadend = e => {
                    this.update();
                }
                reader.readAsDataURL(f);
            }
        }

        function updateDimentions(imgFileSrc, imageDataObject){
            var img = new Image();
            img.onload = function() {
                imageDataObject.size = {
                    width : this.width,
                    height : this.height
                }
                addImgToStore(imageDataObject.name, imageDataObject.size);
            };
            img.src = imgFileSrc;
        }

        this.sliding = false;
        this.sliderMove = "80px";
        function slideleft(e) {
            var photolist = $(e.target.nextElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.css({ left: "-"+this.sliderMove })
                    .prepend(photolist.children('img:last-child'))
                    .animate({ left: 0 }, 200, 'linear', () => {
                        this.sliding = false;
                    });
            }
        };
        function slideright(e) {
            var photolist = $(e.target.previousElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.animate({ left: "-"+this.sliderMove }, 200, 'linear', () => {
                    photolist.css({ left: 0 })
                        .append(photolist.children('img:first-child'));
                    this.sliding = false;
                });
            }
        };

        function deleteThumbnail(e){
            var thumbnail = $(e.target.nextElementSibling);
            for(var thumbnail_i in this.thumbnails){
                if(this.thumbnails[thumbnail_i].name === $(thumbnail[0]).attr("title")){
                    this.thumbnails.splice(thumbnail_i,1);
                    break;
                }
            }
            this.update();
        }

        function loadIntoWorkArea(e){
            imgSelected = e.item;
            riot.mount("workarea",{ img : e.item});
        }
});
riot.tag2('menu', '<div class="dropdown" style="left: -50px"> <div class="dropbtn"><img src="img/icons/menu.svg" width="40px"></div> <div class="dropdown-content"> <a href="#"> <label class="btn-bs-file">Open <input id="browse" type="file" class="filebutton" accept=".fpp,.nimn,.xml,.json" onchange="{openFile}"> </label> </a> <a href="#" onclick="{saveFile}">Save</a> </div> </div>', '', '', function(opts) {
        this.openFile = function(e){
            readDataFile(e);

        }

        this.saveFile = function(){
            selectFileTypeToSave();
        }
});
riot.tag2('plugin-window', '<div id="plugin-window"> <div id="plugin-titlebar"> <span>{opts.plugin.title}</span> <button type="button" class="close" aria-label="Close" onclick="{closeme}"> <span aria-hidden="true" style="color: white;">&times;</span> </button> </div> <div id="plugin-content"></div> </div>', 'plugin-window #plugin-titlebar,[data-is="plugin-window"] #plugin-titlebar{ background: grey; color: white; text-align: center; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } plugin-window #plugin-window,[data-is="plugin-window"] #plugin-window{ border: 2px solid grey; top: 200px; left: 40vw; position: absolute; min-width: 200px; background: #c3bfbf; z-index: 10; } plugin-window #plugin-content,[data-is="plugin-window"] #plugin-content{ padding: 10px; }', '', function(opts) {
        this.on('mount',function(){
            $("#plugin-content").append(`<${opts.plugin.tagName}></${opts.plugin.tagName}>`)
            riot.mount(this.opts.plugin.tagName);
            dragElement(
                document.getElementById("plugin-window"),
                document.getElementById("plugin-titlebar"),
            );
        });

        this.closeme= function(e){
            $("#plugin-window").hide();
        }

        function dragElement(elmnt,titlebar) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (titlebar) {

                titlebar.onmousedown = dragMouseDown;
            } else {

                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;

                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;

                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;

                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {

                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
});
riot.tag2('plugins-menu', '<div class="dropdown" style="float:right;"> <div class="dropbtn"><img src="img/icons/clock.svg" width="35px"></div> <div class="dropdown-content"> <a href="#" each="{plugin in plugins}" onclick="{loadPlugin}">{plugin.title}</a> </div> </div>', '', '', function(opts) {
        this.loadPlugin = function(e){
            riot.mount('plugin-window',e.item);
        }
});
riot.tag2('shortcuts', '<img src="img/icons/keyboard.svg" width="35px" onclick="{showkeymaps}">', '', '', function(opts) {
        this.showkeymaps = function(){
            $.dialog({
                title: 'Keymap',
                content: `
                <table>
                    <tr><td><kbd>del</kbd></td><td> : Delete selected shapes or feature points.<td></tr>
                    <tr><td><kbd>Shift</kbd> + <kbd>a</kbd></td><td> : Select all shapes..<td></tr>
                </table>
                `,
                escapeKey: true,
                backgroundDismiss: true,
                columnClass: 'col-md-8 col-md-offset-4 col-xs-4 col-xs-offset-8',
            });
        }
});
riot.tag2('statusbar', '', '', '', function(opts) {
});
riot.tag2('toolbox', '<div each="{tool,toolid in tools[opts.tools]}" id="{toolid}" class="tool-button" onclick="{selectme}"> <img class="tool-icon" riot-src="img/icons/{tool.icon}"> <div>{tool.title}</div> </div>', 'toolbox .tool-button,[data-is="toolbox"] .tool-button{ text-align: center; margin: 14px 0px; font-size: 0.9em; } toolbox .tool-icon,[data-is="toolbox"] .tool-icon{ width: 40%; margin: 3px 0px; } toolbox .tool-selected,[data-is="toolbox"] .tool-selected{ background: coral; } toolbox .tool-button:not(.tool-selected):hover,[data-is="toolbox"] .tool-button:not(.tool-selected):hover{ background: grey; }', '', function(opts) {

        var tag = this;

        tag.selectme = function (e){

            $(".tool-selected").removeClass("tool-selected");
            var toolDetail = tools[opts.tools][e.item.toolid];
            if(toolDetail.selectAction){
                toolDetail.selectAction();
            }else{
                selectedTool = toolDetail;
                $(e.currentTarget).addClass("tool-selected");
            }

        }
});

riot.tag2('workarea', '<div id="canvas-container"> <img id="img" riot-src="{opts.img.src}" width="{opts.img.size.width}" height="{opts.img.size.height}"> <div id="work-canvas" width="{opts.img.size.width}" height="{opts.img.size.height}"></div> <span id="tooltip-span"></span> </div>', 'workarea #work-canvas,[data-is="workarea"] #work-canvas{ position: absolute; z-index: 1; } workarea #canvas-container,[data-is="workarea"] #canvas-container{ height: calc(100vh - 190px); display: block; overflow: auto; position: relative; }', '', function(opts) {
        $(document).on('click', function(event){
            deselectAll();
            selectedElements = [];
        });

        $(document).keyup(function(e){
            if(e.keyCode == 46){
                selectedElements.forEach(el => {

                    el.selectize(false, {deepSelect:true})
                    if(el.typ === 'point'){
                        detachPoint(el.attr("for") ,el.node.id);
                        el.remove();
                    }else{
                        detachShape(el.node.id);
                        el.parent().remove();
                    }
                });

                selectedElements = [];

            }else if(e.keyCode == 65 && e.shiftKey){

                selectAll();
            }else if(e.keyCode == 65){

            }
        });

        this.on('mount',function() {

            myCanvas = new SVG('work-canvas').size(opts.img.size.width, opts.img.size.height) ;

            drawOnCanvas();

            myCanvas.on('mousedown', function(event){
                deselectAll();
                if(selectedTool && selectedTool.type !== "point" && !alreadyDrawing && selectedTool.drawable){
                    var currentTool = selectedTool.create(event,myCanvas);

                    currentTool.on('drawstart', function(){
                        alreadyDrawing = true;
                    });

                    currentTool.on('drawcancel', function(){
                    });

                    currentTool.on('resizedone', function(){
                        updateShapeDetailInStore(currentTool.node.id, currentTool.rbox(myCanvas), getPoints(currentTool));
                    });
                    currentTool.on('drawstop', function(){
                        alreadyDrawing = false;
                        if( !selectedTool.validate(currentTool)){
                            currentTool.parent().remove();
                            currentTool.remove();
                        }else{
                            attachShapeData(currentTool);

                            attachEvents(currentTool)
                        }
                    });

                    if(currentTool.type !== 'polygon') currentTool.draw(event);
                    selectedElement = currentTool;
                }
            });
            myCanvas.on('mouseup', function(event){
                if(selectedTool && selectedElement)   selectedElement.draw(event);
            });

        } );

        function attachEvents(currentTool){

            onMouse( currentTool.parent(),function(e){
                if(currentTool.node.id === e.target.id){
                    updateShapeDetailInStore(currentTool.node.id, currentTool.rbox(myCanvas), getPoints(currentTool));
                    updateFeaturePoints(currentTool);
                }
            });
            currentTool.parent().on('click',function(e) {
                    if(selectedTool && selectedTool.type === "point"){
                        var point = selectedTool.create(e,currentTool);
                        attachEventsToFeaturePoint(point,currentTool);
                    }else if(e.altKey){
                            deselectAll();
                            currentTool.selectize({ rotationPoint: false, deepSelect:true});
                            selectedElements.push(currentTool);
                    }else{
                        if(!e.ctrlKey){
                            deselectAll();
                        }

                        currentTool.selectize({ rotationPoint: false});
                        selectedElements.push(currentTool);
                    }
                    e.stopPropagation();
                }
            );
        }

        function attachEventsToFeaturePoint(f_point, parent){
            f_point.typ = 'point';
            f_point.attr({
                for: parent.node.id
            })
            attachPointToShape(parent.node.id, f_point.node.id, f_point.rbox(myCanvas));

            onMouse( f_point,function(e){
                updateFeaturePointPosition(f_point);
            });

            f_point.on('click', function(e) {
                if(!e.ctrlKey){
                    deselectAll();
                }
                f_point.selectize({ rotationPoint: false, points: []});
                selectedElements.push(f_point);
                e.stopPropagation();
            });
        }

        function onMouse(shape, dragCB){
            var mousestate = 0;
            shape.on( 'mousedown', function(e) {
                mousestate = 1;
                shape.on( 'mousemove', function(e) {
                    mousestate = 2;
                });
                shape.on( 'mouseup', function(e) {
                    if(mousestate === 2) {
                        dragCB && dragCB(e);
                    }
                    mousestate = 0;
                });
                e.stopPropagation();
            });
        }

        function deselectAll(){
            selectedElements.forEach(el => {
                el.selectize(false, {deepSelect:true});
                el.selectize(false);
            });
            selectedElements = [];
        }

        function selectAll(){
            for(var shapeId in labellingData[ imgSelected.name ].shapes){
                var el = SVG.get(shapeId)
                el.selectize({rotationPoint: false});
                selectedElements.push(el);
            };
        }

    function attachShapeData(shape){
        var points = getPoints(shape);
        attachShapeToImg(shape.node.id ,shape.type, shape.rbox(myCanvas), points);
    }

    function updateFeaturePoints(shape){
        $("[for="+ shape.node.id+"]").each( (i,pointEl) => {
            updateFeaturePointPosition(SVG.get(pointEl.id));
        });
    }

    function updateFeaturePointPosition(pointEl){
        updateFeaturePointInStore(pointEl.attr("for") , pointEl.node.id, pointEl.rbox(myCanvas));
    }

    function getPoints(shape){
        var points;

        switch(shape.type){
            case "rect":
                var box = shape.rbox(myCanvas);
                return [box.x, box.y, box.w, box.h];
            case "circle":
                var box = shape.rbox(myCanvas);
                return [box.cx, box.cy, shape.attr("r")];

            case "polygon":

                var calculatedPoints = [];
                var vector = {
                    x: shape.parent().attr("x"),
                    y: shape.parent().attr("y")
                }
                shape.array().value.forEach(ponitArr => {
                    calculatedPoints.push([ ponitArr[0] + vector.x,  ponitArr[1] + vector.y]);
                });
                return calculatedPoints;

        }
    }

    function drawOnCanvas(){
        for( var shapeId in labellingData[ imgSelected.name ].shapes){
            var shape = labellingData[ imgSelected.name ].shapes[ shapeId ];
            var currentShape;
            switch(shape.type){
                case "rect":
                    var rect = myCanvas.nested()
                        .rect(shape.points[2], shape.points[3])
                        .move(shape.points[0],shape.points[1])
                        .addClass('labelbox shape')
                        .id(shapeId)
                        .resize();
                    rect.parent().draggable();

                    currentShape = rect;

                    break;
                case "circle":
                    var circle = myCanvas.nested()
                        .circle().radius(shape.points[2])
                        .attr("cx",shape.points[0])
                        .attr("cy",shape.points[1])
                        .addClass('labelcircle shape')
                        .id(shapeId)
                        .resize();
                    circle.parent().draggable();

                    currentShape = circle;
                    break;

                case "polygon":
                    var poly = myCanvas.nested()
                        .polygon(shape.points)

                        .addClass('labelpolygon shape')
                        .id(shapeId)
                        .resize();
                    poly.parent().draggable();

                    currentShape = poly;
                    break;
            }

            attachEvents(currentShape);
            drawAllFeaturePoints(shape.featurePoints, currentShape);

        }
    }

    function drawAllFeaturePoints(fPoints, parent){
        for(var fPointId in fPoints){
            var fPoint = getPointToDraw(fPoints[fPointId], parent, {x: 0, y: 0});
            fPoint.id(fPointId);
            attachEventsToFeaturePoint(fPoint,parent);
        }
    }

});
