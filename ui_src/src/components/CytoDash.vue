<template>
  <div
    id="cy"
    name="cy"
    style="width:480px; height:480px; padding:0px; text-align: left;"
  ></div>
</template>

<script>
/*eslint no-unused-vars: "warn"*/

import cytoscape from "cytoscape";
import { onMounted } from "@vue/composition-api";
import { basicCyto } from "./cytoGraphs/basicCyto.js";

export default {
  name: "CytoDash",

  setup(props, context) {
    onMounted(() => {
      let cytoContainer = document.getElementById("cy");
      console.log("CytoDash: onMounted: cytoContainer: ");
      console.log(cytoContainer);

      basicCyto(cytoContainer);
      // alert("mounted");
    });

    return {};
  }
};
</script>
