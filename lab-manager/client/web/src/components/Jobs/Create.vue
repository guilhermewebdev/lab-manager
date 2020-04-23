<template>
    <div id="create-job">
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
                <span class="headline">Novo Trabalho</span>
                </v-card-title>
                <v-card-text>
                    <v-form
                        ref="form"
                        :value="valid"
                    >
                        <v-container>
                            <v-row align="center" justify="center">
                                <v-col cols="12" sm="6" md="6">
                                    <ApolloQuery
                                        :query="kinds"
                                        :variables="{ lab }"
                                    >
                                        <template
                                            v-slot="{ result: { loading, data, error }, query }"
                                        >
                                            <v-autocomplete
                                                label="Tipo *"
                                                autofocus
                                                required
                                                :loading="loading"
                                                :error="error"
                                                :items="data.laboratory.processes"
                                                :rules="[rules.required]"
                                                v-model="form.kind"
                                            >
                                                <template v-slot:append-outer>
                                                    <CreateProcess @created="query.refetch()"></CreateProcess>
                                                </template>
                                            </v-autocomplete>
                                        </template>
                                    </ApolloQuery>                                    
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
                                <v-col cols="12" sm="6" md="6">
                                    <v-menu
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        ref="menu"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="form.deadline.date"
                                                label="Data da Entrega *"
                                                hint="MM/DD/YYYY format"
                                                persistent-hint
                                                type="date"
                                                readonly
                                                prepend-icon="mdi-calendar"
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            v-model="form.deadline.date"
                                            reactive
                                            @input="menu = false"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                            <v-btn text color="primary" @click="$refs.menu.save(form.deadline.date)">OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-menu
                                        v-model="menu2"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        ref="menu2"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="form.deadline.time"
                                                label="Hora da Entrega"
                                                hint="MM/DD/YYYY format"
                                                persistent-hint
                                                type="time"
                                                readonly
                                                prepend-icon="mdi-clock"
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            v-model="form.deadline.time"
                                            reactive
                                            allowed-hours
                                            allowed-minutes
                                            format="24hr"
                                            @input="menu = false"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
                                            <v-btn text color="primary" @click="$refs.menu2.save(form.deadline.time)">OK</v-btn>
                                        </v-time-picker>
                                    </v-menu>
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
import CREATE from '@/graphql/remote/Jobs/Create.gql';
import gql from 'graphql-tag';
import CreateProcess from '@/components/Processes/Create.vue';
export default Vue.extend({
    name: 'create-job',
    data: (vm: Vue) => ({
        dialog: false,
        valid: false,
        today: new Date(),
        lab: Number(localStorage.getItem('lab')),
        loading: false,
        kinds: gql`
            query Processes(
                $lab: Int!
            ){
                laboratory(lab: $lab){
                    processes {
                        name
                        price
                        index
                    }
                }
            }
        `,
        rules: {

        },
        form: {
            description: '',
            price: null,
            kind: '',
            deadline: {
                date: '',
                time: '',
            },
        }
    }),
    computed: {
        data(){
            return {
                description: this.form.description,
                price: this.form.price,
                kind: this.form.kind,
                deadline: new Date(
                    `${(this.form.deadline.date || '')} ${(this.form.deadline.time || '')}`
                ),
                lab: this.lab,
                client: this.$route.params.client,
                patient: this.$route.params.patient,            
            }
        }
    },
    methods: {
        submit(){
            this.loading = true;
            if(this.$refs.form.validate()){
                this.$apollo.mutate({
                    mutation: CREATE,
                    variables: this.data,
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
    },
    components: {
        CreateProcess
    }
})
</script>