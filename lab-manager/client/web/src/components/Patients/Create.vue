<template>
    <div id="create-patient">
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
                <span class="headline">Novo Paciente</span>
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
                                        label="Nome completo *"
                                        autofocus
                                        required
                                        :rules="[rules.required]"
                                        v-model="form.name"
                                    ></v-text-field>
                                </v-col>                            
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        label="Cor dos dentes *"
                                        :rules="[rules.required]"
                                        required
                                        v-model="form.toothColor"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-radio-group
                                        row
                                        v-model="form.gender"
                                        :rules="[rules.required]"
                                        required
                                        label="Gênero *"
                                    >
                                        <v-radio
                                            label="Masculino"
                                            on-icon="mdi-gender-male"
                                            off-icon="mdi-gender-male"
                                            value="M"
                                        ></v-radio>
                                        <v-radio
                                            label="Feminino"
                                            on-icon="mdi-gender-female"
                                            off-icon="mdi-gender-female"
                                            value="F"
                                        ></v-radio>
                                    </v-radio-group>
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
import CREATE from '@/graphql/remote/Patients/Create.gql';
export default Vue.extend({
    name: 'create-patient',
    data: (vm: Vue) => ({
        valid: false,
        dialog: false,
        loading: false,
        form: {
            name: null,
            gender: null,
            toothColor: null,
            lab: Number(localStorage.getItem('lab')),
            client: vm.$route.params.client
        },
        rules: {
            required: (v: string) => !!v || 'Este campo é obrigatório'
        },        
    }),
    methods: {
        async submit(){
            this.$data.loading = true;
            if(this.$refs.form.validate()){
                this.$apollo.mutate({
                    mutation: CREATE,
                    variables: this.$data.form
                })
                    .then(response => {
                        this.$emit('created', response.data)
                        this.$refs.form.reset()
                    })
                    .catch(error => {
                        this.$emit('error', error)
                    })
                    .finally(() => this.$data.loading = false)
            }else this.$data.loading = false;
        }
    }
})
</script>