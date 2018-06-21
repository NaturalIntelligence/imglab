var appConfig = {
    autosave : {
        syncingInterval : 10 * 1000,  //10 seconds
        deleteOnExit : false,
        deleteOnExitIfExported: true
    }
};
function displaySettingsModal(){
    $.dialog({
        title : 'Settings',
        content : '<settings-window></settings-window>',
        escapeKey: true,
        backgroundDismiss: true,
        onContentReady: function(){
            riot.mount('settings-window');
        }
    })
}