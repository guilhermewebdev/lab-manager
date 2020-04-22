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
                    <CreateClient @created="addClient"></CreateClient>                   
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
                    v-if="data.laboratory.clients.length > 0"
                  >
                    <v-list-item
                      v-for="(client, index) in data.laboratory.clients"
                      :key="index"
                      :to="`/client/${client.index}/`"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="client.name"></v-list-item-title>
                        <v-list-item-subtitle>{{ client.telephones.map(tel => tel.telephone).join('; ') }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on: tooltip }">
                              <v-btn @click="alert()" icon v-on="tooltip">
                                <v-icon color="">mdi-information</v-icon>
                              </v-btn>
                          </template>
                          <span>Informações</span>
                      </v-tooltip>                        
                      </v-list-item-action>
                    </v-list-item>
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
      },
      addClient(){alert()}
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