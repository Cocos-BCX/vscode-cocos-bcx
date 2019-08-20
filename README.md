# Cocos-BCX Smart Contract Snippets

[Cocos-BCX](https://www.cocosbcx.io/): The platform for the next generation of digital game economy.

## API

1. `cjson` for json
2. `chainhelper` for cocosbcx contract lua api
3. `bcx` for usefull snippets

Lua api from https://dev.cocosbcx.io/docs/notice-for-use

<img src=https://raw.githubusercontent.com/Cocos-BCX/vscode-cocos-bcx/master/gif/bcxapi.gif >

## contract operation



<img src=https://raw.githubusercontent.com/Cocos-BCX/vscode-cocos-bcx/master/gif/bcx_contract.gif >

1. new contract.

   1.   `contract_name.lua` bcx contract file. Example:

       ```lua
       function hello()
           chainhelper:log('Hello World! 2018 8888')
       end
       ```

       ​

   2.   `contract_name_t.json` bcx contract configuration file. Example:

       ```json
       {
           "title": "demo",
           "name": "contract.helloname",
           "api": "hello",
           "account": "test1",
           "password": "12345678",
           "authority": "COCOS7d7RLEJc4tVYCskhKQLJHnJhhZQb4DWcTGqsWqFwC1mkxXvTY2",
           "testnet": {
               "ws_node_list": [
                   {
                       "url": "ws://39.97.110.222:8040",
                       "name": "Cocos - China - Beijing"
                   },
                   {
                       "url": "ws://47.93.62.96:8049",
                       "name": "Cocos - China - Xiamen"
                   }
               ],
               "networks": [
                   {
                       "core_asset": "COCOS",
                       "chain_id": "7d89b84f22af0b150780a2b121aa6c715b19261c8b7fe0fda3a564574ed7d3e9"
                   }
               ],
               "faucet_url": "http://47.93.62.96:3000",
               "auto_reconnect": false,
               "check_cached_nodes_data": false
           }
       }
       ```

       ​

2. publish/update contract

   1. read account, password, network configuration from `contract_name_t.json` to login and publish contract.

3. test your contract

   1. read account, password, network configuration from `contract_name_t.json` to login and test contract 





## TODO

1. check if the contract name is legal