import * as React from 'react';
import { Tooltip, IconButton, Icon, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, FormControlLabel, InputLabel, TextareaAutosize, Input, InputAdornment, Backdrop, CircularProgress, makeStyles, createStyles, Theme, Snackbar } from '@material-ui/core';

import NumberFormat from 'react-number-format';

import { Icon as MDI } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useForm } from 'react-hook-form';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from 'react-apollo';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

class State {
    dialog: boolean = false;
}

class Form {
    constructor(obj: any) {
        Object.assign(this, obj)
    }
    lab!: number;
    name: string = '';
    description?: string;
    price: number = 0.00;
}

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            isNumericString
            allowEmptyFormatting
            defaultValue={0}
            allowNegative={false}
            fixedDecimalScale
            decimalScale={2}
        />
    );
}

const PROCEDURE_MUTATION = gql`
    mutation create($form: ProcedureInput!){
        upsertProcedure(input: $form){
            created
            procedure {
                index
            }
        }
    }
`
const LAB_QUERY = gql`
    query {
        laboratory @client
    }
`

type Props = {
    onCreate: (procedure: any) => void,
}

export default function CreateProcedure(props: Props) {
    const [state, setState] = React.useState<State>(new State());
    const lab = useQuery(LAB_QUERY)
    const [form, setForm] = React.useState<Form>(new Form({ lab: Number(lab.data?.laboratory) || 0 }));
    const { register, errors, handleSubmit, getValues, reset, triggerValidation } = useForm()
    const classes = useStyles();

    const changeState = (prop: keyof State, value: any) => () => {
        setState({ ...state, [prop]: value })
    }
    const changeForm = (prop: keyof Form) => (e: any) => {
        triggerValidation(e.target.name);
        setForm({ ...form, [prop]: e.target.value })
    }

    const [create, { data, loading, error }] = useMutation(PROCEDURE_MUTATION, {
        variables: { form }
    })

    const submit = (e: React.BaseSyntheticEvent<object, any, any> | undefined) => {
        handleSubmit(() => {
            create().then(() => {
                props.onCreate(data?.data.upsertProcess)
                reset()
                setForm(new Form({ lab: Number(lab.data?.laboratory) || 0 }))
            })
        })(e)
    }

    return (
        <>
            <Tooltip title="Cadastrar Procedimento">
                <IconButton onClick={changeState('dialog', true)}>
                    <Icon component={MDI} path={mdiPlus} />
                </IconButton>
            </Tooltip>
            <Backdrop open={loading} className={classes.backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
            <Snackbar open={!!error} autoHideDuration={6000}>
                <Alert severity="error">{error?.message}</Alert>
            </Snackbar>
            <form
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => { submit(event); event.stopPropagation(); event.preventDefault() }}
                autoComplete="off"
            >
                <Dialog onClose={changeState('dialog', false)} open={state.dialog}>
                    <DialogTitle >Novo Procedimento</DialogTitle>
                    <DialogContent>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item md={9}>
                                <TextField
                                    fullWidth
                                    error={errors.name}
                                    autoFocus
                                    autoComplete="off"
                                    label="Nome *"
                                    value={form.name}
                                    name='name'
                                    helperText={errors.name &&
                                        "É preciso informar um nome"}
                                    onChange={changeForm('name')}
                                    inputRef={register({
                                        required: true,
                                    })}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <TextField
                                    fullWidth
                                    label="Preço *"
                                    error={errors.price}
                                    name="price"
                                    helperText={errors.price &&
                                        "Informe um preço válido"}
                                    onChange={changeForm('price')}
                                    onInput={changeForm('price')}
                                    value={form.price}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom as any,
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputRef: register({
                                            required: true,
                                        }),
                                        name: 'price',
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextField
                                    fullWidth
                                    value={form.description}
                                    multiline
                                    onInput={changeForm('description')}
                                    onChange={changeForm('description')}
                                    name='description'
                                    label="Descrição (opcional)"
                                    variant="filled"
                                    InputProps={{
                                        inputComponent: TextareaAutosize
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={changeState('dialog', false)}>Cancelar</Button>
                        <Button onClick={submit} color="primary" variant="contained">Salvar</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </>
    )
}