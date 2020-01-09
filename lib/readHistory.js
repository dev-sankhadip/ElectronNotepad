"use strict"
const fs=require('fs-extra');
const os=require('os');


const readHistory=()=>
{
    const { homedir, username } = os.userInfo();
    const historyPath = homedir + "/.config/history/info.json";
    return fs.readJson(historyPath,{throws:false})
    .then((res)=>
    {
        if(res==null)
        {
            console.log(null);
        }
        else
        {
            return res;
        }
    })
}

module.exports={
    readHistory
}