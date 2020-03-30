<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
      <v-app-bar-nav-icon
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
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      absolute
      v-model="drawer"
      bottom
      temporary
    >
      Teste
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <verify-auth></verify-auth>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import VerifyAuth from '@/components/VerifyAuth';
export default Vue.extend({
  name: 'App',

  components: {
    VerifyAuth,
  },
  beforeDestroy(){
    if(!localStorage.getItem('keep')){
      document.cookie = 'FAS_CRI=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  },  
});
</script>
