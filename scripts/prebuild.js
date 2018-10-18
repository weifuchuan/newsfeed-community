const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const {resolveApp} = require("../config/kit")

fs.emptyDirSync(resolveApp("build"));
copyPublicFolder();
fs.outputFileSync(resolveApp("src/kit/baseUrl.ts"), `
/*
  This file edit by script. 
*/
export default '';
`)

function copyPublicFolder() {
  fs.copySync(resolveApp("public"), resolveApp("build"), {
    dereference: true,
    filter: file => file !== resolveApp('public/index.html'),
  });
}

