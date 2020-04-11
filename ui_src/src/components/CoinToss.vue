<template>
  <div>
    <!--
      <div v-if="allPtPromisesLoading">Loading...</div>
      <div v-else-if="allPtPromisesError"> Error! {{ allPtPromisesError }}</div>
      <div v-else> Result: {{ gotPtPromises }} </div>
      -->
  </div>
</template>

<script>
/*eslint no-unused-vars: "warn"*/

import { useQuery, useResult } from "@vue/apollo-composable";
import allPtPromisesQuery from "../graphql/queries/allPtPromises.gql";
import * as hcWebClient from "@holochain/hc-web-client";
import { onMounted } from "@vue/composition-api";
import { simpleWs } from "../resolvers/simpleWs.js";

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

    // const { result: allPtPromisesResult, loading: allPtPromisesLoading, error: allPtPromisesError } = useQuery(allPtPromisesQuery);

    // Q: What about directly connecting to the Apollo cache, vs. the querying wrapping?
    /* const gotPtPromises = useResult(
      allPtPromisesResult,
      null,
      data => data.allPtPromises
    ); */

    console.log("CoinToss: setup(): ");    
    console.log();

    
    // console.log(gotPtPromises);

    onMounted(() => {
        console.log("CoinToss: onMounted(): ");
        simpleWs();
    // console.log(res);
    var funcName = "get_agent_address";

    const conductorConfig = {
      url: "ws://localhost",
      port: 33000,
      dna: "pt-promises-dna",
      instanceId: "test-instance",
      zomeName: "core"
    };

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
      // allPtPromisesLoading,
      // allPtPromisesError,
      // gotPtPromises,
      // conductorConfig,
    };
  },
};
</script>
