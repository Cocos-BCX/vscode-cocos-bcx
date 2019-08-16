// 2019.08

import * as vscode from 'vscode';
import * as path from "path";
import * as fs from 'fs';
import { window } from 'vscode';
require('./bcx.node.js');
declare var BCX: any;

import * as utils from './utils';

namespace bcxmgr_ns {
	let inited = false;
	let bcx:any = undefined;

	export async function init() {
		console.log('>> bcxmgr init');
		if (!inited) {
			let contractConfig = utils.getBCXContractConfig();
			if (!utils.checkConfig(contractConfig)) {
				return false;
			}
			var config = contractConfig.testnet;
			bcx = new BCX(config);
			
			let ok = false;
			await bcx.init().then((res: any) => {
				ok = (res.code == 1);
				if (ok) {
				vscode.window.showInformationMessage(`BCX - init success`); 
				} else {
				let msg = `ERR, BCX connect failed; ${res.code}`;
				vscode.window.showErrorMessage(res.message);      
				}
			});
			if (!ok) return ;

			window.showInformationMessage("BCX - try login.");
			await bcx.passwordLogin({
				account: contractConfig.account,
				password: contractConfig.password
			}).then(res => {
				console.info("bcx passwordLogin res", res);
				ok = (res.code == 1);
				if (ok) {
				window.showInformationMessage(`BCX - ${res.data.account_name} login.`);
				} else {
				window.showErrorMessage(`BCX - login failed`);
				}
			}); 
			if (!ok) return ;
		}
		inited = true;
		return true;
	}

	export async function publishContract() {
		window.showInformationMessage("BCX - publishing contract.");
		console.log('publish contract');

		let contractConfig = utils.getBCXContractConfig();
		// publish contract
		console.log("contract name", contractConfig.name)
		let contractName = contractConfig.name;
		let contractCode = fs.readFileSync(contractConfig.luafile).toString();
		let authority = contractConfig.authority;

		let ok = false
		let contractExist = false
		await bcx.queryContract({
			nameOrId: contractName,
			callback: function (res) {
				console.info("queryContract res", res);
				console.info(`${res.message}`);
				contractExist = (res.code == 1);
				if (res.code == 1) { // contract exists
					
				}
			}
		});

		// update contract
		if (contractExist) {
			let onlyGetFee = false;
			await bcx.updateContract({
				nameOrId: contractName,
				data: contractCode,
				onlyGetFee,
			}).then(res => {
				ok = (res.code == 1);
				console.info("div_updateContract res", res);
				window.showInformationMessage(res.code != 1 ? res.message : "BCX - update success.");
			})
			return ;
		}

		// create
		await bcx.createContract({
		  name: contractName,
		  data: contractCode,
		  authority: authority,
		}).then(res => {
		  console.info("contract_create res", res);
		  ok = (res.code == 1);
		  if (ok) {
		    window.showInformationMessage("BCX - create contract success.");
		  } else {
		    window.showErrorMessage(res.message);
		  }
		});
		if (!ok) return ;
	}

	export async function testContract() {
		window.showInformationMessage("BCX - testing contract.");
		console.log('test contract');

		let contractConfig = utils.getBCXContractConfig();

		let ok = false;
		// call 
		let contractName = contractConfig.name;
		let args = contractConfig.api_args;
		let valueList = '"' + JSON.stringify(args) + '"';
		let apiName = contractConfig.api;
		await bcx.callContractFunction({
			nameOrId: contractName,
			functionName: apiName,//["1",1000001,'COCOS']
			valueList: valueList,//['4.2.0',{"type":"Employee","employeeId":"551"}],////[{"level":1,"color":"red","clothes":{"size":7}}],//
			onlyGetFee: false,
		})
		.then(res => {
			ok = (res.code == 1);
			console.info("callContractFunction res", res);
			window.showInformationMessage(res.code != 1 ? res.message : "BCX - call contract function success.");
		});
		if (!ok) return;
	}

	export async function logout() {
		console.log('logout');
		await bcx.logout().then(res => {
		  console.info("logout res", res);
		});
	}
};

export const bcxmgr: any = bcxmgr_ns;
