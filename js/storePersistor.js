//Maintains synchrony between the store and the browser local storage

/*
 * If there is work saved in local storage, it will retrieve it.
 * Otherwise, it'll return an empty json {} 
 */
function confirmUserToLoadBrowserCache(){
    var localStorageData = localStorage.getItem("labellingData");
    if(localStorageData){
        try{
            var localStorageData = JSON.parse(localStorageData);
            if(Object.keys(localStorageData).length > 0){
                $.confirm({
                    title: "Recovery",
                    content : 'You\'ve previously saved data. Would you like to restore that?',
                    buttons : {
                        confirm: {
                            text : 'Yes',
                            action: function () {
                                labellingData =  localStorageData;
                            }
                        },
                        cancel: {
                            text : 'No',
                            action: function () {
                                //no action
                            }
                        }
                    }
                })
            }
        }catch(e){
        }
    }
}

function clearCache(){
    localStorage.clear();
}

//Every 5 seconds, save the current data in localStorage
var synchToBrowser = function() {
    localStorage.setItem("labellingData", JSON.stringify(labellingData));
};
window.setInterval( synchToBrowser , appConfig.autosave.syncingInterval);

setTimeout(confirmUserToLoadBrowserCache,1000);
