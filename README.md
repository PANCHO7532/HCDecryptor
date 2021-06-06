# HCDecryptor
Decryptor for HTTP Custom, HTTP Injector, APK Custom, eProxy, NapsternetV and SocksHTTP-based configuration files.
### This is an javascript port of HCDecryptor tool made by the HCTools Group, using the HCDrill-tg bot codebase

# Requirements
- Download Node.JS [Download Here](https://nodejs.org/en/download/ "Node.JS Download")
- Once installed Node.JS, execute "install-dep" .sh/.bat script depending on your platform, or...
- ... execute `npm update --save` in the same folder as the script.

# Usage
- Move your .hc file to the same folder where the script is located
- Execute `node HCDecryptor.js /path/to/file.hc`
- The decoded output will be displayed to console.

(ensure that the file path is always the last to write in command)

# Argument summary

```
-k, --keyFile           Specify an exact path for a custom keyFile
-l, --language          Set a custom language for the console output/results
-r, --raw               Display only RAW output (without any kind of parsing)
-j, --json              Display only JSON output
-h, --help              Display the help
```

# Language Files and Translation
In the latest update (v2.0.1) we introduced .lang.json files, which contains most strings used for output content on console. Feel free to translate these to your favorite language and pull request your translation to this repo.

All language files should be stored into cfg/lang/ and be set-up using -l parameter when launching the bot... or modifying the "language" parameter on config.inc.json

# Layout Files
In this update (v2.0.1) layout files were introduced. These simple JSON files are located inside cfg/layout/ and contains the header and footer content displayed on console. Including the property indicator. You can have multiple layout files as long as those are located on cfg/layout/ and then specifying the name in the "layout" parameter inside config.inc.json

# Bug Reporting
Report any bugs in the "issues" section of this repository, attaching:
- Full terminal output, including full errors and details (feel free to censor/modify personal information that should appear if you think that it doesn't affect the behaviour of the bot runtime.)
- Full command used to execute the bot
- File(s) *if any* to trigger the error
- Full steps to reproduce the error

The staff will review your issue and check if there's a solution.