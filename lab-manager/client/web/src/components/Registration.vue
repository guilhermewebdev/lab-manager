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
                        label="Nome Completo"
                        clearable
                        v-model="data.fullName"
                        required
                        :rules="[rules.name, rules.required]"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        label="E-mail"
                        clearable
                        :rules="[rules.email, rules.required]"
                        v-model="data.email"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>  
            <v-row>
                <v-col>
                    <v-text-field
                        label="Nome de Usuário"
                        clearable
                        v-model="data.username"
                        :rules="[rules.required, rules.username]"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        label="Senha"
                        clearable
                        v-model="data.password"
                        :rules="[rules.required]"
                        required
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        label="Confirme sua senha"
                        clearable
                        v-model="passwordVerify"
                        required                        
                        :rules="[rules.password, rules.required]"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        @click:append="show2 = !show2"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        label="Nome do laboratório"
                        :rules="[rules.required, rules.name]"
                        clearable
                        v-model="data.lab"
                        required
                    ></v-text-field>
                </v-col>
            </v-row> 
            <v-row>
                <v-col>
                    <v-checkbox
                        required
                        v-model="checkbox"
                        :rules="[rules.terms]"
                        class="mt-0"
                    >
                        <template v-slot:label>
                            <div>
                            Eu concordo com
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <a
                                        target="_blank"
                                        href="http://vuetifyjs.com"
                                        @click.stop
                                        v-on="on"
                                    >
                                        os termos de uso
                                    </a>
                                </template>
                                Abrir em nova aba
                            </v-tooltip>
                            do aplicativo
                            </div>
                        </template>
                    </v-checkbox>
                </v-col>
            </v-row>  
            <v-row>
                <v-col>
                    <v-btn
                        @click.stop="submit"
                        block
                        color="primary"
                        :loading="loading"
                    >Cadastrar</v-btn>
                </v-col>
            </v-row>            
        </v-container>
    </v-form>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: "registration",
    data(){
        return {
            show1: false,
            show2: false,
            loading: false,
            passwordVerify: null,
            data: {
                fullName: null,
                username: null,
                email: null,
                password: null,
                lab: null,                
            },
        }
    },
    computed: {
        rules(){
            return {
                required: v => !!v || "Este campo é obrigatório",
                terms: v => !!v || "Você precisa concordar com os termos",
                name: v => /((-?[A-z])+[A-Za-z]+[ ]?)$/igm.test(v) || "Digite um nome válido",
                email: v => /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/igm.test(v) || 'Digite um email válido',
                username: v => /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm.test(v) || "Nome de usuário inválido",
                password: v => this.data.password === this.passwordVerify || "As senhas não coincidem"
            }
        }
    },
    methods: {
        submit(){
            if(this.$refs.form.validate()){
                alert()
            }
        }
    }
})
</script>