const { homedir, username } = os.userInfo();
const historyPath = homedir + "/.config/history/info.json";
fs.ensureFile(historyPath, (err) => {
    if (err) {
        throw err;
    }
    fs.readJson(historyPath, { throws: false })
        .then((r) => {
            if (r === null) {
                console.log('null');
                const obj = {
                    'paths': [res.filePaths[0]]
                }
                fs.writeFile(historyPath, JSON.stringify(obj));
            }
            else {
                console.log(r);
                let isExist = r.paths.includes(res.filePaths[0]);
                if (!isExist) {
                    r.paths.push(res.filePaths[0]);
                    fs.writeFile(historyPath, JSON.stringify(r));
                }
            }
        })
})