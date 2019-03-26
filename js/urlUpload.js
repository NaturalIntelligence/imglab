// shows a popup box when $(.upload-from-url-button) is clicked
const displayURLUploader = () => {
    $.dialog({
        title : '<i class="icon-link" style="color: #138496; font-size: 1.2em;"></i>Upload image from URL',
        content : '<url-uploader-window></url-uploader-window>',
        escapeKey: true,
        backgroundDismiss: true,
        useBootstrap : false,
        boxWidth : 470,
        onContentReady: function(){
            riot.mount('url-uploader-window');
        }
    })
}

// sends a HTTP Request with pasted link and converts image to base64
const uploadFileFromURL = (url) => {
    console.log(url);

    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = function() {
        const arr = new Uint8Array(this.response);
        const raw = String.fromCharCode(...arr);
        const b64 = btoa(raw);
        const dataURL = `data:image/png;base64,${b64}`;
        console.log(dataURL);

        // here goes code that uses the dataURL
    };
    
    xmlHTTP.send();
}