<template>
  <v-app class="h-100" style="overflow-auto">
    <v-app-bar
      app
      color="primary"
      dense
      elevate-on-scroll
      hover
      tile
    >
      <v-app-bar-nav-icon
        v-if="isAuthenticated"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
      <v-btn
        text
        @click="logout"
        v-if="isAuthenticated"
      >
        <span class="mr-2">Sair</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-btn
        v-else
        to="/auth"
      >Entrar</v-btn>
    </v-app-bar>
    <v-navigation-drawer
      app
      v-model="drawer"
      v-if="isAuthenticated"
      bottom
      temporary
    >
      <navigation></navigation>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <verify-auth ref="verify"></verify-auth>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue';
import VerifyAuth from '@/components/VerifyAuth';
import { mapState } from "vuex";
import { onLogout } from '@/plugins/apollo'
export default Vue.extend({
  name: 'App',
  data: () => ({
    drawer: false,
  }),
  components: {
    VerifyAuth,
    Navigation,
  },  
  methods: {
    async logout(){
      onLogout(this.$apollo.getClient())
        .then(() => {
          this.$router.push('/auth')
        })
        .catch(alert)
    },    
  },
  computed: {
    ...mapState([
      'isAuthenticated'
    ])
  }
});
</script>
