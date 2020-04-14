<template>
<ApolloQuery :query="query" :variables="variables">
    <template slot-scope="{ result: { data, loading } }">
        <v-skeleton-loader
            ref="skeleton"
            v-if="loading"
            type="list-item-avatar-three-line"
            class="mx-auto"
        ></v-skeleton-loader>
        <v-list v-else>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-avatar color="teal" size="48">
                            <span class="white--text headline">{{ data.laboratory.me.fullName[0].toUpperCase() }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-title>@{{ data.laboratory.me.username }}</v-list-item-title>
                    <v-btn
                        icon
                        @click.stop="dark = !dark"
                    >
                        <v-icon>{{ dark ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
                    </v-btn>
                </v-list-item>

                <v-list-item link>
                <v-list-item-content>
                    <v-list-item-title class="title">{{ data.laboratory.me.fullName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ data.laboratory.me.email }}</v-list-item-subtitle>
                </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
             <v-skeleton-loader
                ref="skeleton"
                v-if="loading"
                type="table"
                class="mx-auto"
            ></v-skeleton-loader>
            <v-list
                nav
                dense
                v-else
            >
                <v-list-group
                    prepend-icon="mdi-flask"
                    no-action
                >
                    <template v-slot:activator>
                        <v-list-item-title>Laboratórios</v-list-item-title>
                    </template>
                    <v-list-item
                        v-for="lab in data.laboratories"
                        :key="lab.index"
                        link
                    >                        
                        <v-list-item-title>{{ lab.name }}</v-list-item-title>
                        <v-list-item-icon v-if="lab.index === data.laboratory.index">
                            <v-icon>mdi-check</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                    <v-list-item
                        link
                    >                        
                        <v-list-item-title>Novo Laboratório</v-list-item-title>
                        <v-list-item-icon>
                            <v-icon>mdi-flask-plus-outline</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-group>
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
          
    </template>
</ApolloQuery>    
</template>
<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag';
export default Vue.extend({
    props: {
        drawer: Boolean,
    },
    data: (vm: Vue) => ({
        dark: Boolean(localStorage.getItem('dark')),
        query: gql`
            query Navigation($lab:Int){
                laboratories {
                    name
                    index                    
                }
                laboratory(lab:$lab) {
                    index
                    me {
                        fullName
                        email
                        username
                        id
                    }
                }
            }
        `,
        variables: {
            lab: Number(localStorage.getItem('lab') || 0)
        },
        types: []
    }),
    methods: {
        setLaboratory(lab: number){
            localStorage.setItem('lab', lab.toString())
        }
    },
    watch: {
        dark(newValue){
            localStorage.setItem('dark', newValue)
            this.$vuetify.theme.dark = newValue;
        }
    },
    mounted () {
      this.types = Object.keys(this.$refs.skeleton.rootTypes)
    },
})
</script>