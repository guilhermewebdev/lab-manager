import * as React from 'react';

import { Tooltip, IconButton, Icon, Dialog, DialogTitle, DialogContent, Grid, TextField, Checkbox, FormControlLabel, DialogActions, Button, Grow } from '@material-ui/core';

import { Icon as MDI } from '@mdi/react'
import { mdiPlus, mdiClose } from '@mdi/js';
import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import CreateProcedure from './CreateProcedure'
import { useForm } from 'react-hook-form';

class State {
    dialog: boolean = false;
}

class Stage {
    constructor(obj: Stage) {
        Object.assign(this, obj)
    }
    procedure!: any;
    index!: number;
    price?: number;
}

class Form {
    constructor(obj: any) {
        Object.assign(this, obj)
    }
    name?: string = '';
    lab!: number;
    stages: Array<Stage> = [
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
    const { register, errors, handleSubmit, getValues, reset, triggerValidation } = useForm()
    const lab = useQuery(LAB_QUERY)
    const procedures = useQuery(PROCEDURES_QUERY, { variables: { lab: Number(lab.data?.laboratory) || 0 } })
    const [state, setState] = React.useState<State>(new State())
    const [form, setForm] = React.useState<Form>(new Form({
        lab: Number(lab.data?.laboratory) || 0
    }))
    const voidStage: Stage = new Stage({ procedure: NaN, index: form.stages.length + 1, price: 0 });
    const addStageButton: boolean = (!!form.stages[form.stages.length - 1].procedure)

    const sortStages = (a: any, b: any) => (a.index - 1) - (b.index - 1)
    const changeState = (prop: keyof State, value: any) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setState({ ...state, [prop]: value })
        event.stopPropagation()
        event.preventDefault()
    }
    const changeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }
    const changeStage = (index: number, prop: keyof Stage) => (e: React.ChangeEvent<any | HTMLInputElement | HTMLTextAreaElement>, value?: any) => {
        form.stages[index][prop] = value;
        if (index === form.stages.length - 1) form.stages.push(voidStage);
        setForm({ ...form, stages: [...form.stages] })
    }
    const changeStagePosition = (position: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = + e.target.value;
        if ((value < 1 || value > form.stages.length || !value)) return;
        const oldIndex = form.stages[position].index
        setForm({
            ...form, stages: form.stages.map((stage: Stage, index: number) => {
                if (index === position) return { ...stage, index: value };
                else if (index + 1 === value) return { ...stage, index: oldIndex };
                else return { ...stage, index: index + 1 };
            })
        })
    }
    const removeStage = (position: number) => () => {
        form.stages.splice(position, 1)
        form.stages.map((item, index) => {
            item.index = index + 1;
            return item;
        })
        setForm({ ...form, stages: form.stages })
    }
    const autoRemoveStage = (position: number) => () => {
        if ((position === (form.stages.length - 1)) && !addStageButton && position > 0) {
            form.stages.splice(position, 1)
            setForm({ ...form, stages: form.stages })
        }
    }
    const addStage = () => {
        form.stages.push(voidStage)
        setForm({ ...form, stages: form.stages })
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
                    closeAfterTransition
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={Grow}
                    keepMounted={false}
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
                                    inputRef={register({
                                        required: true,
                                    })}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <TextField
                                    fullWidth
                                    label="Preço *"
                                    onInput={changeForm}
                                    name='price'
                                    value={form.price}
                                    inputRef={register({
                                        required: true,
                                    })}
                                />
                            </Grid>
                            {form.stages.sort(sortStages).map((stage: Stage, index: number) => (
                                <Grid item md={12}>
                                    <Grow in={true}>
                                        <Grid
                                            container
                                            spacing={2}
                                            key={`${stage.index}`}
                                        >
                                            <Grid item md={2}>
                                                <TextField
                                                    value={stage.index}
                                                    fullWidth
                                                    label="Estágio *"
                                                    type="number"
                                                    autoFocus
                                                    onChange={changeStagePosition(index)}
                                                    onInput={changeStagePosition(index)}
                                                    name={`stage[${stage.index}]`}
                                                    inputRef={register({
                                                        required: true
                                                    })}
                                                />
                                            </Grid>
                                            <Grid item md={7}>
                                                <Grid container spacing={0} direction="row">
                                                    <Grid item md={10}>
                                                        <Autocomplete
                                                            fullWidth
                                                            openOnFocus
                                                            onBlur={autoRemoveStage(index)}
                                                            value={stage.procedure}
                                                            getOptionLabel={(procedure: any) => procedure.name}
                                                            options={procedures.data?.laboratory.procedures}
                                                            loading={procedures.loading}
                                                            onChange={changeStage(index, 'procedure')}
                                                            renderInput={(params: RenderInputParams) => (
                                                                <TextField
                                                                    {...params}
                                                                    autoFocus={(index === form.stages.length - 1) && index !== 0}
                                                                    name={`procedure[${stage.index}]`}
                                                                    error={!!procedures.error}
                                                                    label='Procedimento *'
                                                                    inputRef={register({
                                                                        required: true
                                                                    })}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item md={2}>
                                                        <CreateProcedure onCreate={procedures.refetch} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item md={index > 0 ? 2 : 3}>
                                                <TextField
                                                    value={stage.price}
                                                    name={`price[${stage.index}]`}
                                                    fullWidth
                                                    onChange={changeStage(index, 'price')}
                                                    label="Preço *"
                                                />
                                            </Grid>
                                            {index > 0 &&
                                                <Grid item md={1}>
                                                    <IconButton onClick={removeStage(index)}>
                                                        <Icon component={MDI} path={mdiClose} />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grow>
                                </Grid>
                            ))}
                            {addStageButton &&
                                <Grow in={true}>
                                    <Grid item md={12}>
                                        <Button
                                            onClick={addStage}
                                            endIcon={<Icon component={MDI} path={mdiPlus} />}
                                        >Adicionar Estágio</Button>
                                    </Grid>
                                </Grow>
                            }
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