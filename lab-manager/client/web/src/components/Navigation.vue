<template>
<div>
    <v-list>
            <v-list-item class="px-2">
              <v-list-item-avatar>
                <v-avatar color="teal" size="48">
                    <span class="white--text headline">48</span>
                </v-avatar>
              </v-list-item-avatar>
            <v-spacer></v-spacer>
            <v-btn
                icon
                @click.stop="dark = !dark"
            >
                <v-icon>{{ dark ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent'  }}</v-icon>
            </v-btn>
            </v-list-item>

            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="title">Sandra Adams</v-list-item-title>
                <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list
            nav
            dense
          >
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-folder</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Files</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Shared with me</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-star</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Starred</v-list-item-title>
            </v-list-item>
          </v-list>
</div>    
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        drawer: Boolean,
    },
    data: () => ({
        dark: Boolean(localStorage.getItem('dark')),
    }),
    watch: {
        dark(newValue){
            localStorage.setItem('dark', newValue)
            this.$vuetify.theme.dark = newValue;
        }
    }
})
</script>