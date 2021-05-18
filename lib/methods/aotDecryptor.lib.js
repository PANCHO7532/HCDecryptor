/*
* aotDecryptor module
* Description: Yeah, this module aims to decrypt configs made by Art Of Tunnel dev team.
* Author: PANCHO7532, research: @aliraqy_2021
*
* WARNING: This module is in a beta phase forked directly from epro algorithm,
* this may not work for all versions and you would end trying it using /raw
*/
const metadata = {
    "title":"aotDecryptor",
    "author":"PANCHO7532/aliraqy_2021",
    "version":1,
    "schemeLength":4
}
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
module.exports.metadata = metadata;
function aesDecrypt(data, key) {
    //aes but with raw data
    //data = receives b64 data
    //key = buffered sha1 value
    const aesoutp2 = crypto.createDecipheriv("aes-128-ecb", key, null);
    var result = aesoutp2.update(data, "base64", "utf8");
    result += aesoutp2.final("utf-8");
    return result;
}
function parseDecoded(data) {
    //made with tears
    /*
    * ok so, there's a high chance that profile and profilev4 sand so one are from different versions of Art Of Tunnel apps
    * whatever, i'm going to see if i can do black magic with this theory
    */
    var xd, xdKeys;
    var uwu = {};
    console.log(data);
    try {
        xd = JSON.parse(data);
        xdKeys = Object.keys(xd);
    } catch(error) {}
    console.log(xd);
    var connectionMode = [
        "Direct Connection", //probably unused
        "Custom Payload (TCP)",
        "Custom Host Header (HTTP)",
        "Custom SNI (SSL/TLS)",
        "Imported Config" //probably unused
    ];
    var haNodes = [
        //remind me to fill this one
    ]
    if(!!xd["profile"]){
        //legacy
    }
    if(!!xd["description"]) {
        //legacy description
    }
    if(!!xd["profilev4"]) {
        //HA Tunnel Pro
        uwu["connectionMethod"] = connectionMode[xd["profilev4"]["connection_mode"]];
        uwu["payload"] = xd["profilev4"]["custom_payload"];
        uwu["hostHeader"] = xd["profilev4"]["custom_host"];
        uwu["sniValue"] = xd["profilev4"]["custom_sni"];
        uwu["aotRealmHost"] = xd["profilev4"]["use_realm_host"].toString();
        uwu["aotRealmHostValue"] = xd["profilev4"]["realm_host"];
        uwu["aotOverrideHost"] = xd["profilev4"]["override_primary_host"].toString();
        uwu["aotPrimaryHost"] = xd["profilev4"]["primary_host"];
        uwu["aotNode"] = xd["profilev4"]["primary_node"];
        uwu["aotBaseTunnel"] = xd["profilev4"]["base_tunnel"];
    }
    if(!!xd["descriptionv4"]) {
        uwu["note1"] = xd["descriptionv4"];
    }
    if(!!xd["protextras"]) {
        uwu["antiSniff"] = xd["protextras"]["anti_sniff"].toString();
        uwu["mobileData"] = xd["protextras"]["mobile_data"].toString();
        uwu["blockRoot"] = xd["protextras"]["block_root"].toString();
        uwu["antiSniff"] = xd["protextras"]["anti_sniff"].toString();
        uwu["passwordProtected"] = xd["protextras"]["password"].toString();
        uwu["cryptedPasswordValueMD5"] = xd["protextras"]["password_value"].toString();
        uwu["hwidEnabled"] = xd["protextras"]["id_lock"].toString();
        uwu["cryptedHwidValueMD5"] = xd["protextras"]["id_lock_value"].toString();
        uwu["enableExpire"] = xd["protextras"]["expiry"].toString();
        uwu["expireDate"] = new Date(xd["protextras"]["expiry_value"]).toUTCString();
    }
    uwu["credits"] = "Encryption research for this HCDrill module to aliraqy_2021";
    console.log(uwu);
    return JSON.stringify(uwu);
}
function decryptStage(filecontent, configFile) {
    //reeeeeeeeeeeeeeeeeeeeeeeee
    var keyFile;
    var complete = false;
    var response = {};
    response["content"] = "";
    response["raw"] = "";
    response["error"] = 0;
    try {
        keyFile = JSON.parse(fs.readFileSync(configFile["keyFile"]).toString())["aot"];
    } catch(error) {
        response["error"] = 1;
        return response;
    }
    //decrypting stage
    for(let c = 0; c < keyFile.length; c++) {
        key = Buffer.from(keyFile[c], "base64");
        try {
            response["content"] = aesDecrypt(filecontent.toString(), key);
            complete = true;
        } catch(error) {}
    }
    if(complete) {
        response["raw"] = response["content"];
        response["content"] = parseDecoded(response["content"]);
        //return;
        return response;
    } else {
        //response["content"] = parseDecoded(response["content"]); //please comment this one once finished
        response["error"] = 1;
        return response;
    }
}
module.exports.decryptFile = function(file, configFile, type) {
    // This function acts like a "hub" between the decoding methods, less fashioned that the other solution, but hopefully can work.
    var defaultApiError = {};
    defaultApiError["content"] = "";
    defaultApiError["raw"] = "";
    defaultApiError["error"] = 1;
    switch(type) {
        case 0:
            return decryptStage(file, configFile);
        default:
            return defaultApiError;
    }
}