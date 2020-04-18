/*eslint no-unused-vars: "warn"*/

import * as hcWebClient from "@holochain/hc-web-client";

export class hcWsClient {
    constructor(conductorConfig) {

        this.conductorConfig = conductorConfig;
        let WebSocket = require('rpc-websockets').Client;    
        this.WebSocket = WebSocket;    
        
        
        
        // instantiate Client and connect to an RPC server
        // let holochainUri = 'ws://localhost:33000';
        
        // Q: Persistent ws object, or re-create or each call?
        // If persistent, then how should the on "open" work?
        // this.ws = new WebSocket(conductorConfig.url + ":" + conductorConfig.port);
        // this.ws.on('error', function(err) { console.log("ws error: "); console.log(err); });
    }    
    
      // Method
    async getHcInstances() {
        let that = this;
        let ws = new this.WebSocket(this.conductorConfig.url + ":" + this.conductorConfig.port);

        let hcResult = null; //new Promise(() => res);
        console.log("simpleHcWs: getHcInstances(): ");

        let method = 'info/instances';
        let payload = {};
        let timeout = 1000;
        

        // Modified from hc-web-client
        if (ws.ready) {
            return Promise.resolve(ws.call('info/instances', ''))
          } else {
            return new Promise((resolve, reject) => {
              const timer = timeout
                ? setTimeout(() => {
                  reject(`Timeout while waiting for ws to connect. method: ${method}, payload: ${JSON.stringify(payload)}`)
                }, timeout)
                : null
              ws.once('open', () => {
                clearTimeout(timer)
                ws.call(method, payload).then(resolve).catch(reject)
              })
            })
          }

        // Q: Shouldn't this be already pre-loaded before? Not waiting until executing the query? 
        /*
        ws.on('open', function() {
    
            let method = 'info/instances';
            let params = {};            
            // call an RPC method with parameters
            // TODO: Error handling, how?
            ws.call(method, params).then(result => {
                hcResult = result;
                console.log("getHcInstances result arrived: ");
                console.log(hcResult);
            });
        }); 
        console.log("getHcinstances(): hcResult: ");
        console.log(hcResult);
        
        // JSON.parse(result).map(r => { return { ...r, __typename: "HolochainInstance"} });
        return hcResult; // await Promise.all([hcResult]);       
        */
       /*

        let result = hcWebClient.connect({ url: "ws://localhost:33000" }).then(({ callZome, close, onSignal }) => {
            callZome('info/instances', '', '')({}).then((res) => { hcResult = res; console.log("Ryzolf: "); console.log(res); });
        });
        console.log("hcResult: ");
        console.log(result);

        return hcResult;

        */
    }

    async callZome(instanceId, zomeName, zomeFn, args) {
        let that = this;
        let ws = new this.WebSocket(this.conductorConfig.url + ":" + this.conductorConfig.port);
        ws.on('error', function(err) { console.log("ws error: "); console.log(err); });
        
        console.log("simpleHcWs: callZome(): ");
        // let that = this;

        let method = "call";
        let params = {
            instance_id: instanceId,
            zome: zomeName,
            function: zomeFn,
            args: args
        };
        let timeout = 1000;
             // Modified from hc-web-client
        if (ws.ready) {
            return Promise.resolve(ws.call(method, params))
        } else {
            return new Promise((resolve, reject) => {
                const timer = timeout ? setTimeout(() => {
                      reject(`Timeout while waiting for ws to connect. method: ${method}, payload: ${JSON.stringify(params)}`)
                    },
                    timeout) : null;

                ws.once('open', () => {
                    clearTimeout(timer);
                    ws.call(method, params).then(resolve).catch(reject);
                });
                
            })
        }
        
        /*
        try {
            ws.on('open', function() {
                let method = 'call';                    // Q: vs. /instance/zome/fnName syntax?
                let params = {
                    instance_id: instanceId,
                    zome: zomeName,
                    function: zomeFn,
                    args: args
                };
                console.log("params: ");
                console.log(params);

                // call an RPC method with parameters
                try {                    
                    ws.call(method, params).then(result => {        
                        console.log("callZome: ws.call result: ");
                        console.log(result);
                        return result;
                    });
                } catch(err) {
                    console.log("callZome ws.call error: ");
                    console.log(err);
                    return { error: err };
                }
            });
        } catch(err) {
            console.log("Err! ");
            console.log(err);
            return { error: err };
        }  
        */
    }

    async getAgentAddress() {
        console.log("simpleHcWs: getAgentAddress(): ");
        let res = {};
        try {
            res = this.callZome("test-instance", "core", "get_agent_address");            
            return res;

        } catch(e) {
            console.log("Err! ");
            console.log(e);
        }  
    }
}