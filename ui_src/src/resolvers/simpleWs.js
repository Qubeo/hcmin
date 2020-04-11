export async function simpleWs() {
        // import the rpc-websockets library
        let WebSocket = require('rpc-websockets').Client;

        // instantiate Client and connect to an RPC server
        let holochainUri = 'ws://localhost:33000';
        let ws = new WebSocket(holochainUri);    
        
        
        ws.on('open', function() {
    
          let method = 'info/instances';
          let params = {};
          // call an RPC method with parameters
          ws.call(method, params).then(result => {
              console.log(result)
          });

        });

        
        try {
            ws.on('open', function() {
                let method = 'call';
                let params = {
                    instance_id: "test-instance",
                    zome: "core",
                    function: "get_agent_address",
                    args: {}
                };
            
                // call an RPC method with parameters
                try {
                    ws.call(method, params).then(result => {
                    
                    console.log(result)
                });
                } catch(err) {
                    console.log(err);
                }
            });
            } catch(e) {
                console.log("Err!");
                console.log(e);
            }        
            
    }