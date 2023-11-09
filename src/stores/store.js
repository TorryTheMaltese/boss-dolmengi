import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    theme: "theme-light",
    bossParty: [],
  },
  getters: {
    theme: (state) => state.theme,
    bossParty: (state) => state.bossParty,
  },
  mutations: {
    CHANGETHEME(state) {
      if (state.theme === "theme-light") {
        state.theme = "theme-dark";
      } else if (state.theme === "theme-dark") {
        state.theme = "theme-light";
      }
    },
    WRITE_NEW_BOSS_PARTY(state, payload) {
      state.bossParty.push(payload);
    },
    DROP_BOSS_PARTY(state, index) {
      state.bossParty.splice(index, 1);
    },
  },
  actions: {
    CHANGETHEME({ commit }) {
      commit("CHANGETHEME");
    },
    WRITE_NEW_BOSS_PARTY({ commit }, payload) {
      commit("WRITE_NEW_BOSS_PARTY", payload);
    },
    DROP_BOSS_PARTY({ commit }, index) {
      commit("DROP_BOSS_PARTY", index);
    },
  },
});
