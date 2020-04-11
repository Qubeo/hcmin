/*eslint no-unused-vars: "warn"*/


/**
 *  Resolver
 *
 *  TODO: Document the specific schema bindings explicitly somewhere.
 *
 */

// import { createZomeCall } from './holochainClient'
import * as hcWebClient from "@holochain/hc-web-client";

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

async function listPtPromisesZomeCall(instanceId, zomeName) {
  let promiseList = await makeZomeCall(
    instanceId,
    zomeName,
    "list_pt_promises"
  );
  console.log("resolver: listPtPromisesZomeCall(): promiseList: ");
  console.log(promiseList);
  return promiseList;
  // return promiseList.map(dnaToUiPtPromise);
}

export const resolvers = {
  Query: {
    getPtPromise: async () => { //(_, { id }) => {
      return mockPromise;
      // dnaToUiPtPromise(await createZomeCall('/notes/notes/get_note')({ id })),
    },

    allPtPromises: async () => {
      // return mockPromise;
      try {
        return await listPtPromisesZomeCall(
          conductorConfig.instanceId,
          conductorConfig.zomeName
        );
      } catch(e) {
        console.log("Error: resolvers: Query: allPtPromises: ");
        console.log(e);
      }
      // (await createZomeCall('/notes/notes/list_notes')()).map(dnaToUiNote)
    }
  },

  Mutation: {
    /*
    createNote: async (_, { noteInput }) =>
      dnaToUiNote(await createZomeCall('/notes/notes/create_note')({ note_input: noteInput })),

    updateNote: async (_, { id, noteInput }) =>
      dnaToUiNote(await createZomeCall('/notes/notes/update_note')({ id, note_input: noteInput })),

    removeNote: async (_, { id }) =>
      dnaToUiNote(await createZomeCall('/notes/notes/remove_note')({ id }))
    */
  }
};

export default resolvers;
