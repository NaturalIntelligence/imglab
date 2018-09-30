/* This file generates contributors list and adds to readme file of imglab's repo.
 * Run `npm run updateContributors` from terminal to update this readme file.
 *  
 * This script assumes that there is a readme file in parent location and that this file is stored inside js/ directory.
 * This script also assume that there is a "## Contributors" section in readme file of the repo and that this section is always at the end of the readme file and if not present
 * this script will simply append contributors section to the end of the readme file.
 **/

const https = require('https');
const fs = require('fs');

let options = {
    host: 'api.github.com',
    path: '/repos/NaturalIntelligence/imglab/contributors',
    method: 'GET',
    headers: {
        'user-agent': 'node.js'
    }
}

// String variable which will be written to readme file
let contentToWrite = "## Contributors\n";

// Location of readme file
let readmeFile = __dirname + '/../README.md';

let request = https.request(options, response => {
    let body = '';
    response.on('data', chunk => {
        body += chunk;
    });

    response.on('end', () => {
        let json = JSON.parse(body);
        json.forEach(entry => {
            let s = `- <img src="${entry.avatar_url}" width="20" height="20"/> [${entry.login}](https://github.com/${entry.login})\n`;
            contentToWrite += s;
        });

        // Read readme file content
        let contentRead = fs.readFileSync(readmeFile, 'utf8');

        // Get the index of contentRead variable where we will replace old & incomplete contributors list with our new contributors list
        let index = contentRead.indexOf("## Contributors");

        // If there is no such "## Contributors" section already in the file, we will just append this section at the end of readme file
        if (index == -1) {
            index = contentRead.length;
        }

        let s = contentRead.slice(0, index);
        s += contentToWrite;
        fs.writeFileSync(readmeFile, s);
    });

});

request.on('error', e => {
    console.error('Error with http request: ' + e);
});
request.end();