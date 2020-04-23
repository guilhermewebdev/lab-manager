<template>
    <div id="patient-list">
        <ApolloQuery class="mx-0 h-100" :query="query" :variables="client" >
            <template v-slot="{ result: { loading, data, error }, query }">
                <v-skeleton-loader :loading="loading" ></v-skeleton-loader>
                <v-card
                  tile
                  class="h-100"
                >
                  <v-toolbar
                    dense
                  >
                    <v-toolbar-title>Trabahos</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <CreateJob @created="query.refetch()"></CreateJob>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" @click="refresh(query)">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Buscar cliente</span>
                    </v-tooltip>
                  </v-toolbar>
                  <v-list
                    class="overflow-y-auto"
                    :height="height"
                    v-if="data.laboratory.client.patient"
                  >
                    <v-list-item
                      v-for="(job, index) in data.laboratory.client.patient.jobs"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="job.name"></v-list-item-title>
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
import JOBS from '@/graphql/remote/Jobs/List.gql'
import CreateJob from './Create.vue';

export default Vue.extend({
    data: () => ({
        query: JOBS,
        height: 0,
    }),
    computed: {
        client(){
            return {
                lab: Number(localStorage.getItem('lab')),
                client: Number(this.$route.params.client || 0),
                patient: Number(this.$route.params.patient || 0),
            }
        }
    },
    methods: {
      updateHeight(){
        this.height = window.innerHeight - 96;
      },     
    },
    mounted(){
        this.updateHeight()
        window.addEventListener('resize', this.updateHeight)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateHeight)
    },
    components: {
        CreateJob
    }
})
</script>