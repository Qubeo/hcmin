<template>
  <div>


      <div v-if="hcInstancesLoading">Loading...</div>
      <div v-else-if="hcInstancesErr"> hcInstances error! {{ hcInstancesErr }}</div>
      <div v-else> Result: {{ gotHcInstances }} </div>

      <!-- <div v-if="allPtPromisesLoading">Loading...</div>
      <div v-else-if="allPtPromisesError"> Error! {{ allPtPromisesError }}</div>
      <div v-else> Result: {{ gotPtPromises }} </div> -->
      
      <button @click="commitPtPromise(ptMock)">Create PT</button>
      
      

  </div>
</template>

<script>
/*eslint no-unused-vars: "warn"*/

import { useQuery, useResult, useMutation } from "@vue/apollo-composable";
import allPtPromisesQuery from "../graphql/queries/allPtPromises.gql";
import holochainInstancesQuery from "../graphql/queries/holochainInstances.gql";
import addPtPromiseMutation from "../graphql/mutations/createPtPromise.gql";
import * as hcWebClient from "@holochain/hc-web-client";
import { onMounted } from "@vue/composition-api";
import { hcWsClient, simpleWs } from "../resolvers/simpleHcWs.js";

const mockPromise = {
  __typename: "PTPromise",
  id: "xABC",
  title: "Promise title",
  content: "Content",
  createdAt: "12/04/2020"
};

export default {
  name: "CoinToss",

  setup(props, context) {
    // console.log("CoinToss.vue: allPtPromisesQuery: ");
    // console.log(allPtPromisesQuery);

    const { result: hcInstancesRes, loading: hcInstancesLoading, error: hcInstancesErr } = useQuery(holochainInstancesQuery);
    const { mutate: addPtPromiseMutFn } = useMutation(addPtPromiseMutation);

    console.log("CoinToss: allPtPromisesResult: ");
    console.log(allPtPromisesResult);
          
    function commitPtPromise(ptPromiseInput) {
      console.log("commitPtPromise: ");
      // console.log();

      // TODO: Možná přidat kopii toho objektu. Alá Vuetify data table CRUD.
      // Takhle chyba: když přidám víckrát, mění se všechny položky v cache. Tj. reaktivita tam, kde nemá bejt už. Need deep copy asi.
      // Ale bacha na scoping.  
      var resToSave = {};      
      Object.assign(resToSave, ptPromiseInput);
      // console.log(offReqToSave);
      // offReqToSave.id = uuidv4();
      // TODO: Hashing function analogical to the HC one. See my cointoss repo?

      let res = addPtPromiseMutFn({ ptPromiseInput: ptPromiseInput });    
      console.log(res);
      return res;        
    }

    var allPtPromisesResult = {};
    var allPtPromisesError = {};
    var allPtPromisesLoading = {};
    
    const gotHcInstances = useResult(
        hcInstancesRes,
        null,
        data => data
    );

    const gotPtPromises = useResult(
        allPtPromisesResult,
        null,
        data => data //data.allPtPromises
      );


    const conductorConfig = {
      url: "ws://localhost",
      port: 33000,
      dna: "pt-promises-dna",
      instanceId: "test-instance",
      zomeName: "core"
    };

    const ptMock = {
      title: "prdel",
      content: "prdel"
    };

    onMounted(async () => {
        // console.log("CoinToss: onMounted(): ");
        // let hcInstances = await hcWs.getHcInstances();
        // console.log(hcInstances);
      // const { result: ptRes, loading: ptLoad, error: ptErr } = useQuery(allPtPromisesQuery);
      // allPtPromisesResult = ptRes;
      // allPtPromisesLoading = ptLoad;
      // allPtPromisesError = ptErr;

      // let hcAgentAddress = hcWs.getAgentAddress();
      // console.log(hcAgentAddress);

          
      // Q: What about directly connecting to the Apollo cache, vs. the querying wrapping?

/*
    hcWebClient
      .connect({ url: conductorConfig.url + ":" + conductorConfig.port })
      .then(({ callZome, close, onSignal }) => {
        // onSignal(signal => {
        // console.log(signal);
        //  });
        var result = callZome(
          conductorConfig.instanceId,
          conductorConfig.zomeName,
          funcName
        )({});
        console.log("resolver: makeZomeCall(): result: ");
        console.log(result);
        return result;
      });
      */
    })

    return {
      allPtPromisesLoading,
      allPtPromisesError,
      gotPtPromises,
      gotHcInstances,
      hcInstancesLoading,
      hcInstancesErr,
      hcInstancesRes,
      ptMock,
      conductorConfig,
      commitPtPromise
    };
  },
};
</script>
