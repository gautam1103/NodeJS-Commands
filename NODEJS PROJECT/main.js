#!/usr/bin/env node

let inputArr = process.argv.slice(2);

let fs = require("fs");

let path = require("path");

let helpObj = require("./commands/help");

let treeObj = require("./commands/tree");

let organizeObj = require("./commands/organize");

//console.log(inputArr);
// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help

let command = inputArr[0];

let types = {
    media : ["mp4", "mkv"],
    archives: ['zip', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'text','md','html'],
    app: ['exe', 'dmg', 'pkg', 'deb']
}

switch (command){
    case "tree":
        treeObj.treekey(inputArr[1]);
        break;
    case "organize":
        organizeObj.organizeKey(inputArr[1]);
        break;
    case "help":
        helpObj.helpKey();
        break;    
    default:
        console.log("Please Input Right command");
        break;    
}



function treeFn(dirPath) {
    //let destPath;
    if(dirPath== undefined ){
        // console.log("Kindly enter the path");
        
        treeHelper(process.cwd(), "");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);

        if(doesExist) {
            
           treeHelper(dirPath, "");
           return;
    
        } else {
            console.log("Kindly enter the correct path");
            return;
        }

    }
}

function treeHelper(dirPath, indent){

    // is file or folder

    let isFile =fs.lstatSync(dirPath).isFile();
    if (isFile == true){
       let fileName= path.basename(dirPath);
       console.log(indent+ "|--" +fileName);
    } else{
        let dirName = path.basename(dirPath)
        console.log(indent+ "|__"+ dirName);
        let children = fs.readdirSync(dirPath);

        for (let i =0; i<children.length; i++){
            let childPath =  path.join(dirPath,children[i]);
            treeHelper(childPath, indent +"\t");
        }
    }
}





function organizeFn(dirPath) {
    // console.log("organize command implemented for ", dirPath);

    // 1. input ->  Directory path given
    let destPath;
    if(dirPath== undefined ){
        // console.log("Kindly enter the path");

        destPath = process.cwd();
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);

        if(doesExist) {
            
            // 2. create -> organized_files -> directory
             destPath = path.join(dirPath, "organized_files");
            if(fs.existsSync(destPath)==false){
                fs.mkdirSync(destPath);
            }
    
        } else {
            console.log("Kindly enter the correct path");
            return;
        }

    }

    organizeHelper(dirPath, destPath);


    
    
    
}

function organizeHelper(src, dest) {
    // 3. identify cateogries of all the files present in that directory -> 


    let childName = fs.readdirSync(src);
    //console.log(childName);

    for(let i=0; i<childName.length; i++){
        let childAddress = path.join(src, childName[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            //console.log(childName[i]);
            let cateogry = getCategory(childName[i]);
            console.log(childName[i], "belongs to --> ", cateogry);

            // 4. copy/cut files to that organized directory inside of any cateogry of folder

            sendFiles(childAddress, dest, cateogry);

        }
    }
}

function sendFiles(srcFilePath, dest, cateogry){

let cateogryPath = path.join(dest, cateogry);
if(fs.existsSync(cateogryPath)==false){
    fs.mkdirSync(cateogryPath);
}
let fileName = path.basename(srcFilePath);
let destFilePath = path.join(cateogryPath, fileName);
fs.copyFileSync(srcFilePath, destFilePath);

fs.unlinkSync(srcFilePath);

console.log(fileName, "copied to ", cateogry );

}

function getCategory(name){
    let ext = path.extname(name);
    ext=ext.slice(1);
    for(let type in types){
        let cTypeArray = types[type];
        for (let i = 0; i< cTypeArray.length; i++){
            if(ext == cTypeArray.length[i]){
                return type;
            }
        }
        return "others";
    }
}



/* Help Implemented  */

// Help function
function helpFn() {
    console.log(`
    List of All the commands: 
        node main.js tree "directoryPath"
        node main.js organize "directoryPath"
        node main.js help
        `);
}