<template>
    <div id="register">
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
                        shaped
                        raised
                    >
                        <v-card-text>
                            <v-tabs
                            grow                            
                        >
                            <v-tab>Entrar</v-tab>
                            <v-tab>Cadastrar</v-tab>
                            <v-tab-item>
                                <login @inform="inform"></login>
                            </v-tab-item>
                            <v-tab-item>
                                <registration @inform="inform"></registration>
                            </v-tab-item>
                        </v-tabs>
                        </v-card-text>                        
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
         <v-snackbar
            v-model="snackbar.show"
            vertical
            multi-line
            right
            top
        >
            {{ snackbar.message }}
            <v-btn
                :color="snackbar.color"
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
export default Vue.extend({
    components: {
        Login,
        Registration,
    },
    methods: {
        inform(info){
            Object.assign(
                this.snackbar,
                {
                    show: true,
                    ...info
                },
            )
        }
    },
    data: () => ({
        snackbar: {
            show: false,
            message: null,
            color: null,            
        }
    })
})
</script>