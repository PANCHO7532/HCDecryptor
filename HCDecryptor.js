#!/usr/bin/env node
/*
* HCDecryptor v2.0.1
* Coded by PANCHO7532 - P7COMunications LLC
* Copyright (c) HCTools Group - 2021
*
* This program comes with a LICENSE file that you must read before redistributing or modifying this code.
*/
/*
* TODO:
* - fix some "undecryptable" custom and sockshttp files
*/
const fs = require('fs');
const path = require('path');
const mainUtils = require('./lib/mainUtils');
var configFile;
var languageFile;
var layoutFile;
var outputType = 0;
var showHelp = false;
//reading all decoding libs
var libMethodsDirListArray = fs.readdirSync(__dirname + "/lib/methods");
var libMethodsArray = [];
for(let c = 0; c < libMethodsDirListArray.length; c++) {
    if(path.parse(libMethodsDirListArray[c]).ext == ".js") {
        libMethodsArray.push(require(__dirname + "/lib/methods/" + libMethodsDirListArray[c]));
    }
}
//config file reading
try {
    configFile = JSON.parse(fs.readFileSync(__dirname + "/cfg/config.inc.json"));
} catch(error) {
    console.log("[ERROR] - There was an error while loading config file at module " + path.parse(__filename)["base"]);
    process.exit();
}
//language file reading
try {
    languageFile = JSON.parse(fs.readFileSync(__dirname + "/cfg/lang/" + configFile["language"] + ".lang.json"));
} catch(error) {
    console.log("[ERORR] - There was an error while loading language file.");
    process.exit();
}
//layout file reading
try {
    layoutFile = JSON.parse(fs.readFileSync(__dirname + "/cfg/layout/" + configFile["layout"] + ".layout.json"));
} catch(error) {
    console.log("[ERORR] - There was an error while loading the layout file.");
    process.exit();
}
//splash
console.log("HCDecryptor v2.0.1\r\nCopyright (c) HCTools Group - 2021\r\nPorted and re-coded to Javascript by P7COMunications LLC");
for(let c = 0; c < process.argv.length; c++) {
    switch(process.argv[c]) {
        case "--keyFile":
        case "-k":
            console.log("[INFO] - Your new key file path was automatically saved into the main configuration file.");
            configFile["keyFile"] = process.argv[c+1];
            break;
        case "--language":
        case "-l":
            console.log("[INFO] - Your new language preference was automatically saved into the main configuration file.");
            configFile["language"] = process.argv[c+1];
            break;
        case "--raw":
        case "-r":
            outputType = 1;
            break;
        case "--json":
        case "-j":
            outputType = 2;
            break;
        case "--help":
        case "-h":
            showHelp = true;
            break;
    }
}
if(showHelp) {
    var helpContent = [
        "Usage: node script.js [--args -a...]",
        "",
        "--keyFile, -k\t\tSpecify an exact path for a custom keyFile",
        "--language, -l\t\tSet a custom language for the console output/results",
        "--raw, -r\t\tDisplay only RAW output (without any kind of parsing)",
        "--json, -j\t\tDisplay only JSON output",
        "--help, -h\t\tDisplay this help text"
    ];
    for(let c = 0; c < helpContent.length; c++) {
        console.log(helpContent[c]);
    }
    process.exit();
}
//functions
function loopFunction() {
    //this function will execute in an interval method every few seconds
    try {
        fs.writeFileSync(__dirname + "/cfg/config.inc.json", JSON.stringify(configFile, null, "\t"));
    } catch(error) {
        console.log("[ERROR] - An error occured writing the configuration file.");
        process.exit();
    }
}
loopFunction(); //for update with latest changes from cmd
//and here starts the fun
//initialize decryption process (and lib calling)
console.log();
if(!fs.existsSync(process.argv[process.argv.length-1])) {
    console.log("[ERROR] - " + languageFile["invalidFile"]);
    process.exit();
}
var decryptionStage;
for(let c = 0; c < libMethodsArray.length; c++) {
    for(let d = 0; d < libMethodsArray[c].metadata["schemeLength"]; d++) {
        decryptionStage = libMethodsArray[c].decryptFile(fs.readFileSync(process.argv[process.argv.length-1]), configFile, d);
        if(decryptionStage["error"] != 1) { break; }
    }
    if(decryptionStage["error"] != 1) { break; }
}
if(decryptionStage["error"] == 1) {
    console.log("[ERROR] - " + languageFile["decryptionFailed"]);
    process.exit();
}
//start parsing stuff
switch(outputType) {
    case 1:
        console.log(decryptionStage["raw"]);
        break;
    case 2:
        console.log(decryptionStage["content"]);
        break;
    default:
        console.log(mainUtils.jsonResponseParsing(decryptionStage["content"], languageFile, layoutFile));
        break;
}
process.exit();