<template>
    <v-form>
        <v-container
            fluid
        >
            <v-row>
                <v-col>
                    <v-text-field
                        label="Nome de Usuário"
                        clearable
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        label="Senha"
                        clearable
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>
                </v-col>
            </v-row>
                    <v-switch
                        label="Manter conectado"
                        class="mt-0"
                    ></v-switch>
            <v-row>
                <v-col>
                    <v-btn
                        block
                        color="primary"
                    >Entrar</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data(){
        return {
            show1: false,
        }
    }  
})
</script>