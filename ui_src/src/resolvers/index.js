/*eslint no-unused-vars: "warn"*/

/**
 *  Resolver
 *
 *  TODO: Document the specific schema bindings explicitly somewhere.
 *
 */

// import { createZomeCall } from './holochainClient'
import * as hcWebClient from "@holochain/hc-web-client";
import { hcWsClient } from "./simpleHcWs.js";

// Q: Where to feed this config info? Apollo client creation?
const conductorConfig = {
  url: "ws://localhost",
  port: 33000,
  dna: "pt-promises-dna",
  instanceId: "test-instance",
  zomeName: "core"
};

const mockPromise = {
  __typename: "PTPromise",
  id: "xABC",
  title: "Promise title",
  content: "Content",
  createdAt: "12/04/2020"  
}

/**
 * Translate the relevant variable names from the Rust snake_case to JS & GraphQL camelCase
 * @param {PTPromiseZomeResult} ptPromiseResult
 *
 * TODO: Parse all the variables automatically.
 */
function _dnaToUiPtPromise(ptPromiseResult) {
  return {
    ...ptPromiseResult,
    createdAt: ptPromiseResult.created_at
  };
}

async function makeZomeCall(instanceId, zomeName, funcName) {
  hcWebClient
    .connect({ url: conductorConfig.url + ":" + conductorConfig.port })
    .then(({ callZome, close, onSignal }) => {
      // onSignal(signal => {
      // console.log(signal);
      //  });
      var result = callZome(instanceId, zomeName, funcName)(/* params */);
      console.log("resolver: makeZomeCall(): result: ");
      console.log(result);
      
      return result;
    });

  function _onSignal() {
    console.log("Holochain signal received!");
    console.log();
  }
}

const hcWs = new hcWsClient(conductorConfig);

export const resolvers = {
  // Q: Does it make sense to plaster this here? How is Apollo using the resolvers object?
  // Q: Ideally the connection should be handled by Apollo client, no? But then... huh.
    
  Query: {
    
    holochainInstances: async () => {
      // Q: Separate concerns? Put to external function / module / service & compose?
      // Q: How to persist the hcWs object here, not to re-instantiate it in every query, mutation etc.?
      // Should it be an Apollo client-level persistence?
      // const hcWs = new hcWsClient(conductorConfig);  
      let hcJSONArr = [];
      console.log("resolvers: Query: holochainInstances(): ");
      let hcInstances = await hcWs.getHcInstances(); /*.then((res) => { 
        console.log("Fulfilled: res: ");
        console.log(res);
        // hcJSONArr = res.map(d => { return { __typename: "HolochainInstance", ...JSON.parse(d) } });
        // console.log(hcJSONArr);
      });           // TODO: Beware the potentially unpredictable "this." behaviour here.
      // console.log("Query: hcInstances: ");
      // console.log(hcInstances); */
      
      
      //console.log(hcJSONArr[0]);      
      return hcInstances[0];//hcJSONArr[0];      
    },

    getPtPromise: async () => { //(_, { id }) => {
      return mockPromise;
      // dnaToUiPtPromise(await createZomeCall('/notes/notes/get_note')({ id })),
    },

    allPtPromises: async () => {
      let that = this.that;
      console.log("resolvers: Query: allPtPromises(): ");
      // return mockPromise;
      let res = [];
      try {
        console.log(hcWs);
        let res = hcWs.callZome(conductorConfig.instanceId, conductorConfig.zomeName, "list_pt_promises", {});      
        console.log(res);
        return res;
      } catch(e) {
        console.log("Error: resolvers: Query: allPtPromises: ");
        console.log(e);
        return { error: e };  // Q: Error handling, how?
      }
      // (await createZomeCall('/notes/notes/list_notes')()).map(dnaToUiNote)
    }
  },

  Mutation: {
    
    // TODO: Correct the argument format. Align hc and GraphQL argument shape.
    createPtPromise: async (_, { ptPromiseInput }) => {
      //dnaToUiNote(await createZomeCall('/notes/notes/create_note')({ note_input: noteInput })),      
      console.log("Mutation: createPtPromise(): ");

      // Q: callZome vs. createZomeCall - semantics - which is more accurate? What exactly is the dynamics of the process.
      let result = await hcWs.callZome(conductorConfig.instanceId, conductorConfig.zomeName, "create_pt_promise", { entry: ptPromiseInput });
      console.log(result);
      // callZome("create_pt_promise", ptPromiseInput);
      return result;
    }
      /*
    updateNote: async (_, { id, noteInput }) =>
      dnaToUiNote(await createZomeCall('/notes/notes/update_note')({ id, note_input: noteInput })),

    removeNote: async (_, { id }) =>
      dnaToUiNote(await createZomeCall('/notes/notes/remove_note')({ id }))
    */
  }
};

export default resolvers;
