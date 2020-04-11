<template>
  <div class="home">
    <CoinToss></CoinToss>
  </div>
</template>

<script>
// @ is an alias to /src
import CoinToss from "@/components/CoinToss.vue";

export default {
  name: "Home",
  components: {
    CoinToss
  }
};
</script>
