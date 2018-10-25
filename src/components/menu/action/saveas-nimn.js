import nimnImageStore from "./nimn-format-imagestore";
import nimnAppConfig from "./nimn-format-appconfig";
import nimnLabelData from "./nimn-format-labeldata";

export function saveAsNimn(store) {
  var nimn = require("nimnjs");

  let dataImageStore = store.getters["image-store/getStoreData"];
  let dataAppConfig = store.getters["app-config/getStoreData"];
  let dataLabelData = store.getters["label-data/getStoreData"];

  let dataStore = {
    "image-store": dataImageStore,
    "app-config": dataAppConfig,
    "label-data": dataLabelData
  };

  let nimnStore = {
    type: "map",
    detail: [nimnImageStore, nimnAppConfig, nimnLabelData]
  };

  let schemaStore = nimn.buildSchema(nimnStore);
  let stringStore = nimn.stringify(schemaStore, dataStore);

  // download(stringStore, fileName, "application/nimn");
}

/**
 * Save given data to a file
 * @param {Any} data - string data
 * @param {String} filename
 * @param {String} type - Mime type
 */
function download(data, filename, type, encoding = "utf-8") {
  let blobData = new Blob([data], {
    type: type + ";charset=" + encoding
  });
  // saveAs(blobData, filename);
}

/**
 * Ask user to provide output filename
 * @param {string} suggestedName
 * @param {function} cb
 */
function askFileName(suggestedName, cb) {
  // suggestedName || (suggestedName = "Untitled_imgLab");
  // $.confirm({
  //   title: "File Name",
  //   content: `<input class="form-control"  type"text" id="fileName" value="${suggestedName}" >`,
  //   buttons: {
  //     confirm: {
  //       text: 'Save',
  //       btnClass: 'btn-blue',
  //       action: function() {
  //         var fname = this.$content.find('#fileName').val();
  //         if (!fname) {
  //           $.alert('provide a valid name');
  //           return false;
  //         }
  //         cb(fname);
  //       }
  //     },
  //     cancel: function() {
  //       //close
  //     },
  //   } //buttons
  // })
}
