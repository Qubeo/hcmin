<template>
  <div>

    <v-card>
      <div v-if="hcInstancesLoading">hcInstances Loading...</div>
      <div v-else-if="hcInstancesErr">hcInstances error! {{ hcInstancesErr }}</div>
      <div class="float: left" v-else>hcInstances Result: {{ gotHcInstances[0].dna }}</div>
    </v-card>
            

    <v-content>
      <v-container fluid>
        <v-row>
 
          <v-col cols="2">
            <v-card class="pa-4">
                <b>Add entry</b><br />
                <v-text-field outlined dense label="Title" v-model="ptInput.title" />
                <v-text-field outlined dense label="Content" v-model="ptInput.content" />
                <v-btn @click="commitPtPromise(ptInput)" class="mr-4">Create PT</v-btn>                
                <v-btn @click="3">Show list</v-btn><br /><br />
              
                <b>Add link</b><br />
                <v-text-field v-model="ptLink.baseAddr" label="Base addr" dense filled></v-text-field>
                <v-text-field v-model="ptLink.targetAddr" label="Target addr" dense filled></v-text-field>
                <v-text-field v-model="ptLink.type" label="Type" dense filled id="link_type"></v-text-field>
                <v-text-field v-model="ptLink.tag" label="Tag" dense filled id="link_tag"></v-text-field>
                <v-btn @click="addPtlink()">Add link</v-btn>
                <br />
              
            </v-card>
          </v-col>

          <v-col cols="4">
            <v-card class="pa-4; height:500px;" min-height="500">
              <div v-for="(item, index) in gotPtPromises" :key="index" style="float:right">
                <pt-card :ptItem="item"></pt-card>
              </div>
            </v-card>
          </v-col>


          <v-col cols="4">
            <v-card class="pa-4" style="height:500px">
              <cyto-dash style="border-radius:6px; border:1px solid #ccc; float:left;"></cyto-dash>
            </v-card>
          </v-col>

        </v-row>

        <!--
    <div v-if="ptListLoading">ptList Loading...</div>
    <div v-else-if="ptListErr">ptList Error! {{ ptListErr }}</div>
    <div v-else>ptList Result: {{ gotPtPromises }}</div>
        -->
      </v-container>
    </v-content>
  </div>
</template>

<script>
/*eslint no-unused-vars: "warn"*/

import {
  useQuery,
  useLazyQuery,
  useResult,
  useMutation
} from "@vue/apollo-composable";
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
    PtCard
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
    } = useQuery(holochainInstancesQuery, null, { context: { hcWs: hcWs } });

    function handleBla() {
      alert("prdel vole");
    }

    const {
      result: ptListRes,
      loading: ptListLoading,
      error: ptListErr,
      refetch: refetchPt
    } = useQuery(allPtPromisesQuery, null, { context: { hcWs: hcWs } });

    //gotPts();

    console.log("useQuery(prPromisesbla): ");
    console.log(ptListRes);

    const { mutate: addPtPromiseMutFn } = useMutation(addPtPromiseMutation, {
      context: { hcWs: hcWs }
    });

    const ptInput = reactive({
      title: "",
      content: ""
    });

    const ptLink = reactive({
        baseAddr: "",
        targetAddr: "",
        type:  "adjacent",
        tag: "strongly"
    });

    function addPtlink() {
        hcWs.callZome(conductorConfig.instanceId, conductorConfig.zomeName, "create_pt_link", {
          base_addr: ptLink.baseAddr, target_addr: ptLink.targetAddr, link_type: ptLink.type, link_tag: ptLink.tag });
    }

    const gotPtPromises = useResult(
      ptListRes,
      null,
      data => data.allPtPromises
    ); //data.allPtPromises
    const gotHcInstances = useResult(
      hcInstancesRes,
      null,
      data => data.holochainInstances
    );

    const onSignal = signal => {
      console.log("Signal from hc! ");
      console.log(signal);
    };

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
      ptLink,
      addPtlink,
      commitPtPromise
    };
  }
};
</script>

<style scoped>

body {
  font-family: 'Work Sans';
}

</style>
