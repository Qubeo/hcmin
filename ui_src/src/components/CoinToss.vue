<template>
  <div>
    <div v-if="hcInstancesLoading">hcInstances Loading...</div>
    <div v-else-if="hcInstancesErr">
      hcInstances error! {{ hcInstancesErr }}
    </div>
    <div v-else>hcInstances Result: {{ gotHcInstances }}</div>
    <br />

    <div v-for="(item, index) in gotPtPromises" :key="index">
      <pt-card :ptItem="item"></pt-card>
    </div>
    
    <cyto-dash  style="border-radius:3px; border:1px solid #ccc; margin-left: 800px; "></cyto-dash>
    

    <div v-if="ptListLoading">ptList Loading...</div>
    <div v-else-if="ptListErr">ptList Error! {{ ptListErr }}</div>
    <div v-else>ptList Result: {{ gotPtPromises }}</div>

    Pt title: <br />
    <input type="text" v-model="ptInput.title" /><br />
    Pt content: <br />
    <input type="text" v-model="ptInput.content" /><br />
    <button @click="commitPtPromise(ptInput)">Create PT</button>
    <button @click="3">Show list</button>
  </div>
</template>

<script>
/*eslint no-unused-vars: "warn"*/

import { useQuery, useLazyQuery, useResult, useMutation } from "@vue/apollo-composable";
import allPtPromisesQuery from "../graphql/queries/allPtPromises.gql";
import holochainInstancesQuery from "../graphql/queries/holochainInstances.gql";
import addPtPromiseMutation from "../graphql/mutations/createPtPromise.gql";
import * as hcWebClient from "@holochain/hc-web-client";
import { onMounted, reactive } from "@vue/composition-api";
import { hcWsClient, simpleWs } from "../resolvers/simpleHcWs.js";
import CytoDash from "./CytoDash.vue";
import PtCard from "./PtCard.vue";

export default {
  name: "CoinToss",
  components: {
    CytoDash,
    PtCard,
  },
  props: {
    hcPort: Number
  },

  setup(props, context) {

    const conductorConfig = {
      url: "ws://localhost",
      port: props.hcPort ? props.hcPort : 33000,
      dna: "pt-promises-dna",
      instanceId: "test-instance",
      zomeName: "core"
    };

    const hcWs = new hcWsClient(conductorConfig);
    
    const {
      result: hcInstancesRes,
      loading: hcInstancesLoading,
      error: hcInstancesErr,
      onResult
    } = useQuery(holochainInstancesQuery, null, { context: { hcWs: hcWs }});
    

    function handleBla() {
      alert("prdel vole");
    }

    const {
      result: ptListRes,
      loading: ptListLoading,
      error: ptListErr,
      refetch: refetchPt
    } = useQuery(allPtPromisesQuery, null, { context: { hcWs: hcWs }});

    //gotPts();

    console.log("useQuery(prPromisesbla): ");
    console.log(ptListRes);

    const { mutate: addPtPromiseMutFn } = useMutation(addPtPromiseMutation, { context: { hcWs: hcWs } });

    const ptInput = reactive({
      title: "",
      content: ""
    });

    const gotPtPromises = useResult(ptListRes, null, (data) => data.allPtPromises); //data.allPtPromises    
    const gotHcInstances = useResult(hcInstancesRes, null, (data) => data.holochainInstances);

    const onSignal = (signal) => { console.log("Signal from hc! "); console.log(signal); };

    // hcWebClient.addSignalReceptor(onSignal);
    
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

      setTimeout(500);
      refetchPt();
      console.log(res);
      return res;
    }
    
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
    });

    return {
      gotPtPromises,
      gotHcInstances,
      hcInstancesLoading,
      hcInstancesErr,
      hcInstancesRes,
      ptListLoading,
      ptListErr,
      ptInput,
      commitPtPromise,
    };
  },
};
</script>
