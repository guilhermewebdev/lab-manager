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
                                <login></login>
                            </v-tab-item>
                        </v-tabs>
                        </v-card-text>                        
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Login from '@/components/Login.vue'
export default Vue.extend({
    components: {
        Login
    }
})
</script>