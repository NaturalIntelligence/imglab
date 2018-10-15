var cocoFormater = {
    fromCOCO : function(){

    },
    toCOCO : function(labellingData){
        var categories = [];

        var cocoData = {
            images : [],
            "type": "instances",
            annotations : [],
            categories : []
        }
        var images = Object.keys(labellingData);

        //Add images
        for(var image_i = 0 ; image_i < images.length; image_i++){
            var imageName = images [image_i];
            cocoData.images.push({
                "file_name": imageName,
                "height": labellingData[ imageName ].size.height,
                "width": labellingData[ imageName ].size.width,
                "id": image_i+1
            });

            //Add annotations
            for(var shape_i=0; shape_i < labellingData[ imageName ].shapes.length;  shape_i++ ){
                var shape = labellingData[ imageName ].shapes[ shape_i ];
                if(categories.indexOf( shape.category ) === -1){
                    categories.push(shape.category);
                }
                var area, points = [];
                if(shape.type === "polygon"){
                    points = [];
                    for(var i = 0; i < shape.points.length; i++){
                        points = points.concat(shape.points[i]);
                    }
                    area = calcArea(points);
                }else if(shape.type === "circle"){
                    points = [shape.points[0], shape.points[1]];
                    area = shape.points[2] * shape.points[2] * Math.PI;
                }else if(shape.type === "rect"){
                    points = [
                        shape.points[0], shape.points[1], 
                        shape.points[0]+shape.points[2], shape.points[1], 
                        shape.points[0]+shape.points[2], shape.points[1] + shape.points[3],
                        shape.points[0], shape.points[1] + shape.points[3]
                    ];
                    area = calcArea(points);
                }
                
                cocoData.annotations.push({
                    segmentation : [
                        points
                    ],
                    area : area,
                    "iscrowd": 0,
                    "image_id": image_i+1,
                    "bbox": shape.bbox,
                    "category_id": categories.indexOf(shape.category) + 1,
                    "id": shape_i+1,
                    "ignore": 0
                })
            }
        }

        //Add cateogries
        for(var category_i = 0 ; category_i < categories.length; category_i++){
            cocoData.categories.push({
                "supercategory": "none",
                "id": category_i + 1,
                "name": categories [ category_i ] || "uncategorized"
            })
        }

        return cocoData;
    }

}

function calcArea(coords){
    var area = 0;
    var numCoords = coords.length;

    for(var i=0; i<numCoords; i+=2){
        nexti = (i+2) % numCoords; //make last+1 wrap around to zero
        area += coords[i]*coords[nexti+1] - coords[i+1]*coords[nexti];
    }
    return Math.abs(area/2);
}