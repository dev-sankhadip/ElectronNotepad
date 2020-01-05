const { ipcRenderer }=require('electron');

ipcRenderer.on('filedata',(event, data)=>
{
    console.log(data);
    document.getElementById("editor").value=data.data;
})