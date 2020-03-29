<template>
    <v-form
        ref="form"
        @keypress.enter.native="submit"
    >
        <v-container
            fluid
        >
            <v-row>
                <v-col>
                    <v-text-field
                        label="Nome de Usuário"
                        :rules="rules.username"
                        clearable
                        v-model="data.username"
                        required
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
                        @click:append="show1 = !show1"
                        counter
                        v-model="data.password"
                        required
                        :rules="rules.password"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-switch
                        label="Manter conectado"
                        class="mt-0"
                    ></v-switch>
                </v-col>
                <v-col class="pt-4">
                    <a to="#">Esqueceu o login ou a senha?</a>
                </v-col>
            </v-row>           
            <v-row>
                <v-col>
                    <v-btn
                        @click.stop="submit"
                        block
                        color="primary"
                        :loading="loading"
                    >Entrar</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>
<script lang="ts">
import Vue from 'vue'
import LOGIN from '@/graphql/Login.gql'
export default Vue.extend({
    data(){
        return {
            show1: false,
            rules: {
                username: [
                    v => !!v || "É preciso informar o nome de usuário",
                    v => /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gi.test(v) || "Informe um nome de usuário válido"
                ],
                password: [
                    v => !!v || "É preciso informar a senha"
                ]
            },
            data: {
                username: null,
                password: null,
            },
            loading: false,
        }
    },
    apollo: {
        login:LOGIN,
        $client: 'b',
    },
    methods: {
        async submit(){
            this.loading = true
            if(this.$refs.form.validate()){
                this.$apollo.mutate({
                    mutation: LOGIN,
                    variables: this.$data.data,
                })
                    .then(console.log)
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false)
            }
            this.loading = false;
        },
    }
})
</script>