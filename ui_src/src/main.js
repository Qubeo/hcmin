import Vue from "vue";
import App from "./App.vue";
import VueCompositionApi from "@vue/composition-api";
import apolloClient from "./apolloClient";
// import Note from './components/Note'
// import * as serviceWorker from './serviceWorker'
// import { ApolloClient } from "apollo-client";
import { ApolloClients } from "@vue/apollo-composable";
import router from "@/router";
import { provide } from "@vue/composition-api";
import vuetify from "./plugins/vuetify";
// import VueApollo from '@vue/apollo-option'
// import VueApolloComponents from '@vue/apollo-components'

Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

new Vue({
  setup() {
    provide(ApolloClients, {
      default: apolloClient
      // hasuClient: apolloClientHasu
    });
  },

  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
