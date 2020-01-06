const { BrowserWindow,app,Menu, MenuItem, dialog, ipcMain }=require('electron');
const fs=require('fs-extra');
const os=require('os');

app.on('ready', build_app);


function build_app()
{
    var app_window=new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
        },
        title:'Download Manager'
    });
    app_window.loadFile('asset/index.html');
    app_window.openDevTools();

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
                    click:function()
                    {
                        console.log('open recent');
                    }
                }
            ]
        },
    ];
    
    const menu_design=Menu.buildFromTemplate(menu_list);
    Menu.setApplicationMenu(menu_design);

    function uploadFileWindow()
    {
        dialog.showOpenDialog(app_window,{properties:['openFile']})
        .then((res)=>
        {
            fs.readFile(res.filePaths[0],'utf-8',(err,data)=>{
                const { homedir, username }=os.userInfo();
                const historyPath=homedir+"/.config/history/info.json";
                fs.ensureFile(historyPath,(err)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    fs.readJson(historyPath,{throws:false})
                    .then((r)=>
                    {
                        if(r===null)
                        {
                            console.log('null');
                            const obj={
                                'paths':[res.filePaths[0]]
                            }
                            fs.writeFile(historyPath,JSON.stringify(obj));
                        }
                        else
                        {
                            console.log(r);
                            let isExist=r.paths.includes(res.filePaths[0]);
                            if(!isExist)
                            {
                                r.paths.push(res.filePaths[0]);
                                fs.writeFile(historyPath, JSON.stringify(r));
                            }
                        }
                    })
                })
                app_window.webContents.send("filedata",{"data":data, "path":res.filePaths[0]});
            })
        })
        .catch((err)=>
        {
            console.log(err);
        })
    }

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