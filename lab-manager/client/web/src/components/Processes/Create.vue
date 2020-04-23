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
export default Vue.extend({
    name: 'create-process',
    data: (vm: Vue) => ({
        loading: false,
        valid: false,
        dialog: false,
        form: {},
        rules: [],
    })
})
</script>