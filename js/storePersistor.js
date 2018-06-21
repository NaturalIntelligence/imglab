//Maintains synchrony between the store and the browser local storage

/*
 * If there is work saved in local storage, it will retrieve it.
 * Otherwise, it'll return an empty json {} 
 */
function getLabellingDataFromLocalStorage(){
    var localStorageData = localStorage.getItem("labellingData");
    if(localStorageData){
        try{
            var localStorageData = JSON.parse(localStorageData)
        }catch(e){
            return {};
        }
    }
    return {};
}

//Every 5 seconds, save the current data in localStorage
var synchToBrowser = function() {
    localStorage.setItem("labellingData", JSON.stringify(labellingData));
};
window.setInterval( synchToBrowser , appConfig.autosave.syncingInterval);


