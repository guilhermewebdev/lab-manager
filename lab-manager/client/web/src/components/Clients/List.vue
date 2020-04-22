<template>
    <div id="clients">
        <ApolloQuery class="mx-0 h-100" :query="query" :variables="{ lab }" >
            <template v-slot="{ result: { loading, data } }">
                <v-skeleton-loader :loading="loading" ></v-skeleton-loader>
                <v-card
                  tile
                  class="h-100"
                >
                  <v-app-bar
                    dense
                  >
                    <v-toolbar-title>Dentistas</v-toolbar-title>

                    <v-spacer></v-spacer>
                    <CreateClient></CreateClient>                   
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Buscar cliente</span>
                    </v-tooltip>
                  </v-app-bar>
                  <v-list
                    class="overflow-y-auto"
                    :height="height"
                  >
                    {{ data }}
                  </v-list>   
              </v-card>
            </template>
        </ApolloQuery>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CLIENTS from '@/graphql/remote/Clients/List.gql';
import CreateClient from './Create.vue';
export default Vue.extend({
    name: 'Clients',
    data: () => ({
        query: CLIENTS,
        lab: Number(localStorage.getItem('lab')),
        height: 0,
    }),
    components: {
      CreateClient
    },
    methods: {
      updateHeight(){
        this.height = window.innerHeight - 96;
      }
    },
    mounted(){
        this.updateHeight()
        window.addEventListener('resize', this.updateHeight)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateHeight)
    },

})
</script>