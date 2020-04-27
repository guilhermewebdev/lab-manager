<template>
    <div id="create-procedure">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                        <v-btn icon v-on="{ ...tooltip, ...dialog }">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Novo Procedimento</span>
                </v-tooltip>
            </template>
            <v-card
                :loading="loading"
                :disabled="loading"
            >
                <v-card-title>
                <span class="headline">Novo Procedimento</span>
                </v-card-title>
                <v-card-text>
                    <v-form
                        ref="form"
                        :value="valid"
                    >
                        <v-container>
                            <v-row align="center" justify="center">
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        label="Nome do procedimento *"
                                        autofocus
                                        required
                                        :rules="[rules.required]"
                                        v-model="form.name"
                                    ></v-text-field>
                                </v-col>                            
                                 <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        label="Preço *"
                                        :rules="[rules.required]"
                                        required
                                        type="number"
                                        min="0"
                                        prefix="R$"
                                        v-model="form.price"
                                    ></v-text-field>
                                </v-col>                                                               
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea
                                        label="Descrição (Opcional)"
                                        auto-grow
                                        rows="2"
                                        filled
                                        v-model="form.description"
                                    ></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                    <small>* Representa campos obrigatórios</small>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" text @click="$refs.form.reset()">Limpar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="" text @click="dialog = false">Fechar</v-btn>
                    <v-btn color="primary" text @click="submit">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CREATE from '@/graphql/remote/Procedures/Create.gql';
import gql from 'graphql-tag';
export default Vue.extend({
    name: 'create-procedure',
    data: (vm: Vue) => ({
        loading: false,
        valid: false,
        dialog: false,
        form: {
            name: '',
            description: '',
            price: null,
            lab: Number(localStorage.getItem('lab'))
        },
        lab: Number(localStorage.getItem('lab')),
        rules: [],
        procedures: gql`
            query Procedures($lab: Int){
                laboratory(lab: $lab){
                    procedures{
                        index
                        price
                        name
                        description
                    }
                }
            }
        `,
    }),
    methods: {
        async submit(){
             this.loading = true;
            if(this.$refs.form.validate()){
                this.$apollo.mutate({
                    mutation: CREATE,
                    variables: this.form,
                })
                    .then(response => {
                        this.$emit('created', response.data)
                        this.$refs.form.reset()
                    })
                    .catch(error => {
                        this.$emit('error', error)
                    })
                    .finally(() => this.loading = false)
            }else this.loading = false;
        }
    }
})
</script>