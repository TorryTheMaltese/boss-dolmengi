<template>
  <div :class="getTheme">
    <HeaderBox />
    <div class="container">
      <!-- <boss-party-table></boss-party-table> -->
    </div>
  </div>
</template>

<script>
import store from "./stores/store.js";
import HeaderBox from "./components/HeaderBox.vue";
// import BossPartyTable from "./components/BossPartyTable.vue";

export default {
  name: "App",
  store,
  components: {
    HeaderBox,
    // BossPartyTable,
  },
  computed: {
    getTheme() {
      return store.state.theme;
    },
  },
};
</script>

<style lang="scss">
@import "./styles/themes.scss";
@import "./styles/_variables.scss";

@each $theme in $themes {
  .#{map-get($theme, "name")} {
    background-color: map-get($map: $theme, $key: "background");
    color: map-get($map: $theme, $key: "text");
    width: 100%;
    min-height: 100%;
    .container {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      max-width: $max-width;
      margin: auto;
      display: flex;
      background-color: map-get($map: $theme, $key: "background");
    }
  }
}
</style>
