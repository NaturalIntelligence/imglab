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
    var x = event.pageX - rect.left.toFixed(0);
    var y = event.pageY - rect.top.toFixed(0);
    return {
        x: x,
        y: y
    };
}

function logout() {
    localStorage.removeItem('beevalley_login');
    window.location = pluginsStore.beenest.host;
}

// aidition beenest publick methods
function axiosClient() {
    // axios.defaults.withCredentials = true;
    var instance = axios.create({
        baseURL: pluginsStore.beenest.baseURL,
        // headers: {Authorization: 'Bearer ' + pluginsStore.beenest.token,},
        withCredentials: true
    });
    instance.interceptors.response.use(function(response) {
     //对响应数据做些事
      return response;
   }, function(error) {
     //请求错误时做些事
     if (error.response.status === 401) {
        logout();
     } else if (error.response.status === 403 && error.response.data && error.response.data.error.code === "16") {
        alert('尚余其它类型任务未完成，无法请求此类型新任务。');
     } else if (error.response.status === 403) {
        alert('未授权操作。请关注公众号“淘然视界”，联系客服获取权限。');
     } else {
        alert('系统错误，请稍候重试。');
     }
     return Promise.reject(error);
   });
   return instance;
}

function updateDimentions(imgFileSrc, imageDataObject) {
    var img = new Image();
    img.onload = function() {
        imageDataObject.size = {
            width : this.width,
            height : this.height,
            scaledWidth: this.width,
            scaledHeight: this.height,
            imageScale: 1
        }
        //给全局添加画框
        if(imageDataObject.workType === 'count'){
            if (!imageDataObject.preloadedShapes) {
                imageDataObject.preloadedShapes = [];
            }
            var backgroundShape = {
                                        "id" : imageDataObject.name + '_global',
                                        "type" : 'rect',
                                        "points": [0, 0, imageDataObject.size.width, imageDataObject.size.height],
                                        "editable": false
                                  };
            if(imageDataObject.preloadedFeaturePoints){
                backgroundShape.featurePoints = imageDataObject.preloadedFeaturePoints;
            }
            imageDataObject.preloadedShapes.push(backgroundShape);
        }
        addImgToStore(imageDataObject);
    }
    img.src = imgFileSrc;
}

function readImageBlob(blob, imgData) {
    var reader = new FileReader();
    reader.onload = function(e) {
        imgData['src'] = e.target.result;
        updateDimentions(e.target.result, imgData);
    }
    reader.onloadend = function(e) {
    }
    reader.readAsDataURL(blob);
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

  function deleteAndNextImage(selectedImageName) {

    delete labellingData[ selectedImageName ];
    imgSelected = Object.keys(labellingData).length > 0 ? labellingData[Object.keys(labellingData)[0]] : {size: {}, shapes: []};
    riot.mount('workarea');

  }

  function clearAllImages() {
    imgSelected = {size: {}, shapes: []};
    Object.keys(labellingData).forEach(function (prop) {
        delete labellingData[prop];
    });
    riot.mount('workarea');
  }