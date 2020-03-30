import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
  },
  mutations: {
    setAuth(state, payload){
      state.isAuthenticated = payload
    },
    setToken(state, payload){
      state.token = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
