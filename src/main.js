import Vue from "vue";
import App from "./App.vue";
import store from "./stores/store.js";

Vue.config.productionTip = false;
import "./styles/style.scss";

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
