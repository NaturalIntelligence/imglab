var appConfig = {
    autosave : {
        syncingInterval : 10 * 1000,  //10 seconds
        enable : true,
        deleteIfExported: true, //Mark the data as saved when exported as nimn format, and delte the copy from browser cache.
    },
    zoomStepSize: 0.1,
    featurePointColor: '#ee0000'
};
function displaySettingsModal(){
    $.dialog({
        title : '<i class="icon-wrench" style="color: #138496; font-size: 1.2em;"></i>Settings',
        content : '<settings-window></settings-window>',
        escapeKey: true,
        backgroundDismiss: true,
        useBootstrap : false,
        boxWidth : 470,
        onContentReady: function(){
            riot.mount('settings-window');
        }
    })
}
