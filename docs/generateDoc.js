const fs = require("fs");
const glob = require("glob");
const vuedoc = require("@vuedoc/md");

const options = [
  {
    // Filename has to be relative to docs folder
    filename: "../src/components/**/**/*.vue"
  }
];

/**
 * Parse vue file to markdown via vuedoc
 * @param {String} filename - filename
 */
function parseFile(filename) {
  vuedoc
    .md({ filename })
    .then(document => fs.appendFileSync("component-api.md", document))
    .catch(err => console.log("error", err));
}

/**
 * Parse an array of files to markrdown
 * @param er - error
 * @param files - list of files
 */
function parseFiles(er, files) {
  if (er) throw er;
  files.forEach(parseFile);
}

/**
 * Parse files to markdown via globs in options[i].filename
 */
function parse(options) {
  if (!options || !options.length) return;
  glob(options[0].filename, parseFiles);
  parse(options.slice(1));
}

fs.writeFile("component-api.md", "", err => {
  if (err) throw err;
  parse(options);
});
// vuedoc.md(options).then(document => console.log(document));
// console.log(vuedoc);
