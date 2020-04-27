<template>
    <div id="create-process">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                        <v-btn icon v-on="{ ...tooltip, ...dialog }">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Novo Tipo</span>
                </v-tooltip>
            </template>
            <v-card
                :loading="loading"
                :disabled="loading"
            >
                <v-card-title>
                <span class="headline">Novo Tipo</span>
                </v-card-title>
                <v-card-text>
                    <v-form
                        ref="form"
                        :value="valid"
                    >
                        <ApolloQuery
                            :query="procedures"
                            :variables="{ lab }"
                        >
                            <template
                                v-slot="{ result: { loading, data, error }, query }"
                            >
                                <v-container>
                                    <v-row align="center" justify="center">
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                                label="Nome do processo *"
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
                                                @change="distributePrice"
                                                :messages="
                                                    (form.price&&defaultPrice)?
                                                        (defaultPrice=!form.price)?
                                                            `${(form.price>defaultPrice)?'Acréscimo de':'Desconto de'} ${form.price-defaultPrice}`
                                                        :''
                                                    :''
                                                "
                                                prefix="R$"
                                                v-model="form.price"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row
                                        align="center"
                                        justify="center"
                                        v-for="(stage, index) in form.stages"
                                        :key="index"
                                    >
                                        <v-col cols="2" sm="2" md="2">
                                            <v-text-field
                                                label="Etapa *"
                                                :rules="[rules.required]"
                                                required
                                                type="number"
                                                suffix="º"
                                                min="1"
                                                :max="form.stages.length"
                                                @input.native="setStage(index)"
                                                @change.native="setStage(index)"
                                                v-model="stage.index"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-autocomplete
                                                label="Procedimento *"
                                                required
                                                :autofocus="index > 0"
                                                :loading="loading"
                                                :error="error"
                                                :items="data.laboratory.procedures.map(i => ({ text: i.name, value: i }))"
                                                :rules="[rules.required]"
                                                v-model="stage.procedure"
                                                @blur="removeStage(index)"
                                                @change="
                                                    (stage.procedure != null)?addStage(index):removeStage(index);
                                                    stage.price = stage.procedure.price;
                                                    setPrice();
                                                "
                                            >
                                                <template v-slot:append-outer>
                                                    <CreateProcedure @created="query.refetch()"></CreateProcedure>
                                                </template>
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col cols="4" sm="4" md="4">
                                            <v-text-field
                                                label="Preço *"
                                                :rules="[rules.required]"
                                                required
                                                type="number"
                                                min="0"
                                                :messages="
                                                    (stage.price&&stage.procedure)?
                                                        (stage.price!=stage.procedure.price)?
                                                            `${(stage.price>stage.procedure.price)?'Acréscimo de':'Desconto de'} ${stage.price-stage.procedure.price}`
                                                            :''
                                                        :''
                                                "
                                                :append-outer-icon="(index > 0)?'mdi-close':''"
                                                @click:append-outer="form.stages.splice(index, 1); setPrice()"
                                                prefix="R$"
                                                @change="setPrice"
                                                v-model="stage.price"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row
                                        v-if="addButton"
                                    >
                                        <v-col>
                                            <v-btn
                                                @click="addStage(form.stages.length-1)"
                                            >
                                                <span>Adicionar estágio</span>
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row align="center" justify="center">
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
                            </template>
                        </ApolloQuery>    
                    </v-form>
                    <small>* Representa campos obrigatórios</small>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" text @click="form.stages.length = 1; $refs.form.reset();">Limpar</v-btn>
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
import CREATE from '@/graphql/remote/Processes/Create.gql';
import gql from 'graphql-tag';
import CreateProcedure from '@/components/Procedures/Create.vue';
export default Vue.extend({
    name: 'create-process',
    data: () => ({
        loading: false,
        valid: false,
        dialog: false,
        form: {
            name: '',
            description: '',
            price: NaN,
            lab: Number(localStorage.getItem('lab')),
            stages: [
                {
                    procedure: null,
                    price: NaN,
                    index: 1,
                }
            ]
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
    computed: {
        addButton(){
            return Boolean(this.$data.form.stages[this.$data.form.stages.length - 1].procedure)
        },
        priceList(){
            return Number(this.form.stages.reduce(
                (accumulator, currentValue) => (Number(accumulator) + Number(currentValue.price)),
                0
            ))
        },
        defaultPrice(){
            return Number(this.form.stages.reduce(
                (accumulator, currentValue) => (Number(accumulator) + Number(currentValue?.procedure?.price || 0)),
                0
            ))
        }
    },
    methods: {
        async addStage(index: number){
            if(index === (this.$data.form.stages.length - 1) && this.addButton){
                this.$data.form.stages.push({
                    procedure: null,
                    price: null,
                    index: index + 2
                })
            }
        },
        async removeStage(index: number){
            if(!this.addButton && (index === (this.$data.form.stages.length - 1)) && index > 0){
                this.$data.form.stages.splice(index, 1)
            }
        },
        async setPrice(){
            this.form.price = this.priceList
        },
        async distributePrice(){
            const price = (this.form.price||0)/this.form.stages.filter(item => (item.price && item.procedure)).length;
            this.form.stages = this.form.stages.map((item: any) => {
                item.price = price;
                return item;
            })
        },
        async setStage(position: number){
            const myIndex = this.form.stages[position].index;
            if(myIndex > this.form.stages.length) {
                this.form.stages[position].index = position + 1
                return;
            }
            this.form.stages = this.form.stages.map((value: any, index: number) => {
                if(index == position) value.index = myIndex;
                else if(index + 1 == myIndex) value.index = position + 1
                else value.index = index + 1;                
                return value;
            }).sort((a: any, b: any) => (a.index - 1) - (b.index - 1));
        }
    },
    components: {
        CreateProcedure
    }
})
</script>