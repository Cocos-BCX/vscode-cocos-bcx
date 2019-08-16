// 2019.08

'use strict';

// imports
import * as vscode from 'vscode';
import * as path from 'path';

// @path: .lua or _t.json
export function getContractFiles() {
	let file = `${(<any>vscode.window).activeTextEditor.document.fileName}`
	let luafile = file.replace('.lua', '_t.json');
	let configfile = file.replace('_t.json', '.lua')
	if (path.extname(luafile) == '.json') {
		[luafile, configfile] = [configfile, luafile];
	}
	return { luafile, configfile };
}

export function getBCXContractConfig() {
	let files = getContractFiles();
	let config = require(files.configfile);
	config.luafile = files.luafile;
	config.configfile = files.configfile;
	return config;
}

export function checkConfig(config) {
	if (config.testnet == undefined) {
		vscode.window.showErrorMessage("BCX - missing testnet config.");
		return false;
	}

	// TODO:
	// check contract name valid

	// more
	return true
}
