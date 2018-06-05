riot.tag2('actionbar', '', '', '', function(opts) {
});
riot.tag2('facepp', '', '', '', function(opts) {
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
            imgSelected = e.item.name;
            riot.mount("workarea",{ img : e.item});
        }
});
riot.tag2('menu', '', '', '', function(opts) {
});
riot.tag2('statusbar', '', '', '', function(opts) {
});
riot.tag2('toolbox', '<div each="{tool,toolid in tools[opts.tools]}" id="{toolid}" class="tool-button" onclick="{selectme}"> <img class="tool-icon" riot-src="img/icons/{tool.icon}"> <div>{tool.title}</div> </div>', 'toolbox .tool-button,[data-is="toolbox"] .tool-button{ text-align: center; margin: 14px 0px; font-size: 0.9em; } toolbox .tool-icon,[data-is="toolbox"] .tool-icon{ width: 40%; margin: 3px 0px; } toolbox .tool-selected,[data-is="toolbox"] .tool-selected{ background: coral; } toolbox .tool-button:not(.tool-selected):hover,[data-is="toolbox"] .tool-button:not(.tool-selected):hover{ background: grey; }', '', function(opts) {

        var tag = this;

        tag.selectme = function (e){

            $(".tool-selected").removeClass("tool-selected");
            $(e.currentTarget).addClass("tool-selected");
            selectedTool = tools[opts.tools][e.item.toolid];

        }
});

riot.tag2('workarea', '<div id="canvas-container"> <img id="img" riot-src="{opts.img.src}" width="{opts.img.size.width}" height="{opts.img.size.height}"> <div id="work-canvas" width="{opts.img.size.width}" height="{opts.img.size.height}"></div> <span id="tooltip-span"></span> </div>', 'workarea #work-canvas,[data-is="workarea"] #work-canvas{ position: absolute; z-index: 1; } workarea #canvas-container,[data-is="workarea"] #canvas-container{ height: calc(100vh - 150px); display: block; overflow: auto; position: relative; }', '', function(opts) {
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

                console.log("selecting all")
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

                    currentTool.draw(event);
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
                    if(selectedTool.type === "point"){
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
            myCanvas.each(function(i,shapeEl){
                shapeEl.forEach(function(el){
                    if(el.node.tagName = 'svg' ){
                        el.selectize({rotationPoint: false});
                        selectedElements.push(el);
                    }
                })
            });
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
        for( var shapeId in labellingData[imgSelected].shapes){
            var shape = labellingData[imgSelected].shapes[ shapeId ];
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