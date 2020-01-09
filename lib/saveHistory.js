"use strict"
const fs = require('fs-extra');
const os = require('os');

const savePathsToHistory=(path)=>
{
    const { homedir, username } = os.userInfo();
    const historyPath = homedir + "/.config/history/info.json";

    // set directory for saving file path history
    fs.ensureFile(historyPath, (err) => {
        if (err) {
            throw err;
        }

        // read history json file
        fs.readJson(historyPath, { throws: false })
            .then((r) => {
                if (r === null) {
                    console.log('null');
                    const obj = {
                        'paths': [path]
                    }
                    // write path to json file
                    fs.writeFile(historyPath, JSON.stringify(obj));
                }
                else {
                    let isExist = r.paths.includes(path);
                    if (!isExist) {
                        r.paths.push(path);
                        // write path to json file
                        fs.writeFile(historyPath, JSON.stringify(r));
                    }
                }
            })
    })
}


module.exports = {
    savePathsToHistory
}