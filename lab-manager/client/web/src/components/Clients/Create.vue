<template>
    <div id="create-client">        
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                        <v-btn icon v-on="{ ...tooltip, ...dialog }">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Adicionar cliente</span>
                </v-tooltip>
            </template>
            <v-card
                :loading="loading"
                :disabled="loading"
            >
                <v-card-title>
                <span class="headline">Novo Cliente</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-container>
                            <v-row align="center">
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        label="Nome completo *"
                                        autofocus
                                        required
                                        :rules="[rules.required, rules.name]"
                                        v-model="form.name"
                                    ></v-text-field>
                                </v-col>                            
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        label="Email *"
                                        type="mail"
                                        :rules="[rules.required, rules.email]"
                                        required
                                        v-model="form.email"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        label="Endereço *"
                                        :rules="[rules.required]"
                                        required
                                        v-model="form.address"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field
                                        label="Desconto"
                                        :rules="[rules.discount]"
                                        type="number"
                                        required
                                        suffix="%"
                                        min="0"
                                        value="0"
                                        max="100"
                                        v-model="form.discount"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="4"
                                    v-for="(tel, index) in form.telephones"
                                    :key="index"
                                >
                                    <v-text-field
                                        :label="`Telefone  ${(index > 0)?' (Opcional)':' *'}`"
                                        :rules="[rules.required, rules.telephone]"
                                        :clearable="index == 0"
                                        required
                                        :append-outer-icon="(index > 0)?'mdi-close':''"
                                        v-model="tel.telephone"
                                        :autofocus="index > 0"
                                        @blur="removeTel(index)"
                                        @change="(tel.telephone != null)?addTel(index):removeTel(index)"
                                        @click:append-outer="form.telephones.splice(index, 1);"
                                        v-mask="['(##) ####-####', '(##) # ####-####']"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols='4'
                                    v-if="addTelButton"
                                >                                    
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-btn
                                                icon
                                                v-on="tooltip"
                                                @click="addTel(form.telephones.length - 1)"
                                            >
                                                <v-icon right small>mdi-plus</v-icon>
                                                <v-icon left>mdi-phone</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Adicionar Telefone</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                    <small>* Representa campos obrigatórios</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" text @click="dialog = false">Fechar</v-btn>
                    <v-btn color="primary" text @click="submit">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import UPSERT from '@/graphql/remote/Clients/Upsert.gql'
export default Vue.extend({
    name: 'create-client',
    data: (vm: Vue) => ({
        dialog: false,
        loading: false,
        rules: {
            required: v => !!v || 'Este campo é obrigatório',
            discount: v => v >= 0 && v <= 100 || "Você não pode oferecer esse desconto",
            name: v => /((-?[A-z])+[A-Za-z]+[ ]?)$/igm.test(v) || "Digite um nome válido",
            email: v => /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/igm.test(v) || 'Digite um email válido',
            telephone: v => (v.length === 16 || v.length === 15) || 'Está faltando algum número',
        },
        form: {
            lab: Number(localStorage.getItem('lab')),
            name: null,
            telephones: [
                { telephone: null }
            ],
            address: null,
            email: null,
            discount: 0,
        }
    }),
    computed: {
        addTelButton(){
            return Boolean(this.$data.form.telephones[this.$data.form.telephones.length - 1].telephone)
        }
    },
    methods: {
        async addTel(tel: number){
            if(tel === (this.$data.form.telephones.length - 1) && this.addTelButton){
                this.$data.form.telephones.push({ telephone: null })
            }
        },
        async removeTel(index: number){
            if(!this.addtelButton && (index === (this.$data.form.telephones.length - 1)) && index > 0){
                this.$data.form.telephones.splice(index, 1)
            }
        },
        async submit(){
            alert()
            this.loading = true;
            if(this.$refs.form.validate()){
                this.$apollo.mutate({
                    mutation: UPSERT,
                    variables: this.$data.form
                })
                    .then(res => {
                        this.$emit('created', res.data)
                        this.$refs.form.reset()
                    })
                    .catch(err => { 
                        alert(err)
                        this.$emit('error', err)
                    })
                    .finally(() => this.loading = false)
            }
        }
    }
})
</script>