"use strict"
const { BrowserWindow,app,Menu, MenuItem, dialog, ipcMain }=require('electron');
const fs=require('fs-extra');
const os=require('os');
const { savePathsToHistory }=require('./lib/saveHistory');
const { readHistory }=require('./lib/readHistory');

app.on('ready', build_app);


async function build_app()
{
    //open the desktop window
    var app_window=new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
        },
        title:'Download Manager'
    });
    app_window.loadFile('asset/index.html');
    

    // set open recent submenu
    let submenuOfOpenRecent=[];
    let paths=readHistory();
    const allPaths=await paths;
    allPaths.paths.map((path)=>
    {
        submenuOfOpenRecent.push({label:path, click:function(){ openRecentFile(path) }});
    })

    //set all menu
    let menu_list=[
        {
            label:'File', 
            submenu:[
                {
                    label:'Open File...',
                    click:function()
                    { 
                        uploadFileWindow(app_window);
                    }
                },
                {
                    label:'Open recent...',
                    submenu:submenuOfOpenRecent,
                    click:function()
                    {
                        console.log('open recent');
                    }
                }
            ]
        },
    ];
    
    // set the menu to desktop app
    const menu_design=Menu.buildFromTemplate(menu_list);
    Menu.setApplicationMenu(menu_design);

    // execute function when openFIleWIndow opens
    function uploadFileWindow()
    {
        dialog.showOpenDialog(app_window,{properties:['openFile']})
        .then((res)=>
        {
            fs.readFile(res.filePaths[0],'utf-8',(err,data)=>{
                // save file path in history
                savePathsToHistory(res.filePaths[0]);
                app_window.webContents.send("filedata",{"data":data, "path":res.filePaths[0]});
            })
        })
        .catch((err)=>
        {
            console.log(err);
        })
    }

    //open recent file in notepad
    function openRecentFile(path)
    {
        console.log(path);
        fs.readFile(path,'utf-8',(err,data)=>{
            //save file path to history
            savePathsToHistory(path);
            app_window.webContents.send("filedata",{"data":data, "path":path});
        })
    }

    // execute function when openFolderWindow opens
    function uploadFolderWindow()
    {
        dialog.showOpenDialog(app_window,{properties:['openDirectory']})
        .then((res)=>
        {
            console.log(res.filePaths[0]);
        }).catch((err)=>
        {
            console.log("err");
        })
    }


    // recieve new file data and path throught main and renderer method
    ipcMain.on('newdata',(e,arg)=>
    {
        fs.writeFile(arg.path,arg.file,(err)=>
        {
            if(err)
            {
                throw err;
            }
            console.log('data saved');
        })
    })
}