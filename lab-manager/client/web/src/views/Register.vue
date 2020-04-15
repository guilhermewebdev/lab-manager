<template>
    <div id="register" v-if="!isAuthenticated">
        <v-container>
            <v-row>
                <v-col
                    md="7"
                ></v-col>
                <v-col
                    cols="12"
                    xs="12"
                    md="5"
                    lg="5"
                    xl="4"
                >
                    <v-card
                        tile
                        hover
                        :disabled="loading"
                    >
                        <v-card-text>
                            <v-tabs
                            grow                            
                        >
                            <v-tab>Entrar</v-tab>
                            <v-tab>Cadastrar</v-tab>
                            <v-tab-item>
                                <login v-model="loading" @inform="inform"></login>
                            </v-tab-item>
                            <v-tab-item>
                                <registration v-model="loading" @inform="inform"></registration>
                            </v-tab-item>
                        </v-tabs>
                        </v-card-text>                        
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
         <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            vertical
            multi-line
            right
            top
        >
            {{ snackbar.message }}
            <v-btn
                text
                @click="snackbar.show = false"
            >
                OK
            </v-btn>
         </v-snackbar>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Login from '@/components/Login.vue'
import Registration from '@/components/Registration.vue'
import { Route } from 'vue-router'
import store from '@/store';

export default Vue.extend({
    components: {
        Login,
        Registration,
    },
    methods: {
        inform(info: any){
            Object.assign(this.snackbar, info)
            this.snackbar.show = true
        }
    },
    beforeRouteEnter(to: Route, from: Route, next: Function){
        if(!store.state.isAuthenticated) next({ query: { next: from.fullPath } });
        else next(false);
    },
    computed: {
        isAuthenticated(){
            return store.state.isAuthenticated
        }
    },
    data: () => ({
        snackbar: {
            show: false,
            message: null,
            color: null,
        },
        loading: false,
    })
})
</script>