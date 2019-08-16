// 2019.07

import * as vscode from 'vscode';
import * as path from "path";
import * as fs from 'fs';
import { window } from 'vscode';

import { bcxmgr } from "./bcxmgr";

function getTerminal(): vscode.Terminal {
  let length = (<any>vscode.window).terminals.length;
  if (length > 0) {
    return (<any>vscode.window).activeTerminal;
  } else {
    let terminal = (<any>vscode.window).createTerminal();
    terminal.show();
    return terminal;
  }
}

/*
1. choose folder
2. input contract name
*/
async function createContract() {
  let ret = await vscode.window.showOpenDialog({
    canSelectFiles:false,
    canSelectFolders:true,
    openLabel:"Where to create BCX contract"
  });

  if (!ret) {
    return;
  }

  let folderpath = ret[0].path;
  vscode.window.showInformationMessage(folderpath);

  const result = await vscode.window.showInputBox({
    value: 'bcx.lua',
    valueSelection: [0, 3],
  });
  if (!result) {
    vscode.window.showInformationMessage('BCX - create contract canceld.');
    return ;
  }

  let basename = result.replace('.lua','');
  let luafile = path.join(folderpath, basename+'.lua');
  let configfile = path.join(folderpath, basename+'_t.json');

  if (fs.existsSync(luafile) || fs.existsSync(configfile)) {
    vscode.window.showErrorMessage(`BCX - ${luafile} or ${configfile} exists.`);
    return ;
  }

  let ext = vscode.extensions.getExtension('Cocos-BCX.vscode-cocosbcx');
  let luafile_from = path.join((<any>ext).extensionPath, 'contracts', 'helloworld.lua');
  let configfile_from = path.join((<any>ext).extensionPath, 'contracts', 'helloworld_t.json');

  if (vscode.workspace) {

    // write
    fs.writeFileSync(luafile, fs.readFileSync(luafile_from));
    fs.writeFileSync(configfile, fs.readFileSync(configfile_from));

    vscode.workspace.openTextDocument(luafile).then(doc => {
      vscode.window.showTextDocument(doc);
    });

    // create `Untitled` file
    /*
    vscode.workspace.openTextDocument({
      language:'lua',
      content:fs.readFileSync(luafile_from).toString()
    }).then(doc => {
      vscode.window.showTextDocument(doc);
    });
    vscode.workspace.openTextDocument({
      language: 'json',
      content: fs.readFileSync(configfile_from).toString()
    }).then(doc => {
      vscode.window.showTextDocument(doc);
    });
    */

    vscode.window.showInformationMessage(`BCX - create ${luafile} and ${configfile}`);
  }
}

async function publishContract() {
  vscode.window.showInformationMessage("BCX - Publish contract!");

  await bcxmgr.init();
  await bcxmgr.publishContract();
}

async function testContract() {
  vscode.window.showInformationMessage("BCX - Test contract!");

  await bcxmgr.init();
  await bcxmgr.testContract();
}

export async function activate(context: vscode.ExtensionContext) {

  // compile
  var command = 'bcx.new_contract';
  context.subscriptions.push(vscode.commands.registerCommand(command, createContract));

  command = 'bcx.publish_contract';
  context.subscriptions.push(vscode.commands.registerCommand(command, publishContract));

  command =  'bcx.test_contract';
  context.subscriptions.push(vscode.commands.registerCommand(command, testContract));
}

export async function deactivated() {
}

