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

const mockInstances = [{
  __typename: "HolochainInstance",
  id: "pdel",
  dna: "dnatantule",
  agent: "agentule"
}];

const mockPromise = {
  __typename: "PTPromise",
  id: "xABC",
  title: "Promise title",
  context: "Prdel, tam",
  content: "Content",
  createdAt: "12/04/2020",
  lifetime: 12,
  location: {
    __typename: "Location",
    city: "KH",
    country: "Pha",
    position: {
      __typename: "Position",
      lat: 12.34,
      lng: 48.66
    }
  }  
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
      console.log("resolvers: Query: holochainInstances(): ");      
      
      let hcInstances = await hcWs.getHcInstances();
      console.log(hcInstances);
      
      hcInstances = hcInstances.map(d => { return { ...d, __typename: "HolochainInstance" }; });      
      return await hcInstances;
    },

    getPtPromise: async () => { //(_, { id }) => {
      return mockPromise;
      // dnaToUiPtPromise(await createZomeCall('/notes/notes/get_note')({ id })),
    },

    allPtPromises: async () => {
      // let that = this.that;        // !!!: I'm getting "this is undefined" here. Bacha.
      console.log("resolvers: Query: allPtPromises(): ");
      //return [mockPromise];
      
      let res = [];
      try {
        console.log(hcWs);
        let res = await hcWs.callZome(conductorConfig.instanceId, conductorConfig.zomeName, "list_pt_promises", {});      
        console.log(res);

        let resJSON = (JSON.parse(res).Ok).map(d => {
          // Q: Is there some elegant spread / destructuring / map pattern?
          let loc = { ...d.location, __typename: "Location" };
          loc.position = { ...loc.position, __typename: "Position" };
          let resGql = { ...d, __typename: "PTPromise", location: loc };
          console.log(resGql);
          return resGql;
        });
        return resJSON;
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
      let resJSON = { ...JSON.parse(result).Ok, __typename: "PTPromiseInput" }; // TODO: Error handle.
              
      console.log(resJSON);
      return resJSON;
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
