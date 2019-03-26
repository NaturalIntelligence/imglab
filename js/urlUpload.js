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