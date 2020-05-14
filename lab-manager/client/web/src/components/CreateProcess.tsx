import * as React from 'react';

import { Tooltip, IconButton, Icon, Dialog, DialogTitle, DialogContent, Grid, TextField, Checkbox, FormControlLabel, DialogActions, Button, Grow } from '@material-ui/core';

import { Icon as MDI } from '@mdi/react'
import { mdiPlus } from '@mdi/js';
import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import CreateProcedure from './CreateProcedure'

class State {
    dialog: boolean = false;
}

class Stage {
    constructor(obj: Stage) {
        Object.assign(this, obj)
    }
    procedure!: number;
    index!: number;
    price?: number;
}

class Form {
    constructor(obj: any) {
        Object.assign(this, obj)
    }
    name?: string = '';
    lab!: number;
    stages: Stage[] = [
        { procedure: NaN, index: 1, price: 0 }
    ];
    price?: number;
    description?: string = '';
    needColor?: boolean;
}

const LAB_QUERY = gql`
    {
        laboratory @client
    }
`
const PROCEDURES_QUERY = gql`
    query procedures($lab: Int!){
        laboratory(lab: $lab){
            procedures {
                name
                price
                index
            }
        }
    }
`;

export default function CreateProcess() {
    const lab = useQuery(LAB_QUERY)
    const procedures = useQuery(PROCEDURES_QUERY, { variables: { lab: Number(lab.data?.laboratory) || 0 } })
    const [state, setState] = React.useState<State>(new State())
    const [form, setForm] = React.useState<Form>(new Form({
        lab: Number(lab.data?.laboratory) || 0
    }))
    const changeState = (prop: keyof State, value: any) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setState({ ...state, [prop]: value })
        event.stopPropagation()
        event.preventDefault()
    }
    const changeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    return (
        <>
            <Tooltip title="Cadastrar Processo">
                <IconButton onClick={changeState('dialog', true)}>
                    <Icon component={MDI} path={mdiPlus} />
                </IconButton>
            </Tooltip>
            <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => { event.stopPropagation(); event.preventDefault() }}>
                <Dialog
                    onClose={changeState('dialog', false)}
                    open={state.dialog}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={Grow}
                >
                    <DialogTitle>Novo Processo</DialogTitle>
                    <DialogContent>
                        <Grid
                            container
                            spacing={2}
                        >
                            <Grid item md={9}>
                                <TextField
                                    fullWidth
                                    label="Nome *"
                                    name='name'
                                    value={form.name}
                                    onInput={changeForm}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <TextField
                                    fullWidth
                                    label="Preço *"
                                    onInput={changeForm}
                                    name='price'
                                    value={form.price}
                                />
                            </Grid>
                            <Grid item md={12}>
                                {form.stages.map((stage, index) => (
                                    <Grid
                                        container
                                        spacing={2}
                                        key={index}
                                    >
                                        <Grid item md={2}>
                                            <TextField
                                                value={stage.index}
                                                fullWidth
                                                label="Estágio *"
                                                type="number"
                                            />
                                        </Grid>
                                        <Grid item md={7}>
                                            <Grid container spacing={0} direction="row">
                                                <Grid item md={10}>
                                                    <Autocomplete
                                                        fullWidth
                                                        options={procedures.data?.laboratory.procedures}
                                                        loading={procedures.loading}
                                                        renderInput={(params: RenderInputParams) => (
                                                            <TextField
                                                                {...params}
                                                                error={!!procedures.error}
                                                                label='Procedimento *'
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item md={2}>
                                                    <CreateProcedure />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={3}>
                                            <TextField
                                                value={stage.price}
                                                fullWidth
                                                label="Preço *"
                                            />
                                        </Grid>
                                    </Grid>
                                )).sort((a: any, b: any) => a.index - b.index)}
                            </Grid>
                            <Grid item md={12}>
                                <FormControlLabel
                                    label="Precisa de cor?"
                                    control={
                                        <Checkbox
                                            indeterminate={form.needColor == (null || undefined)}
                                            onChange={() => setForm({ ...form, needColor: !form.needColor })}
                                            checked={form.needColor}
                                            name="needColor"
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={changeState('dialog', false)}>Cancelar</Button>
                        <Button color="primary" variant="contained">Salvar</Button>
                    </DialogActions>
                </Dialog>
            </form >
        </>
    )
}