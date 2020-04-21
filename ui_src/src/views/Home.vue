<template>
  <div class="home">
    <CoinToss :hcPort="props.hcPort"></CoinToss>
  </div>
</template>

<script>
// @ is an alias to /src
import CoinToss from "@/components/CoinToss.vue";

export default {
  name: "Home",
  components: {
    CoinToss
  },
  props: {
    hcPort: Number
  },

  setup(props) {

    return {
      props
    }
  }

};
</script>
