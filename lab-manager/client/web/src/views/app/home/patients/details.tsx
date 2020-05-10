import * as React from 'react';

import {
    Card,
    Grid,
    CardContent,
    CardHeader,
    Divider,
    makeStyles,
    Theme,
    createStyles,
    Typography,
    Chip,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Snackbar,
    CircularProgress,
} from '@material-ui/core';

import { useParams, Redirect } from 'react-router';
import { Link } from 'react-router-dom'

import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';

import { Alert } from '@material-ui/lab';

const createTheme = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: '100%',
        },
        card: {
            height: '100%',
        },
        telephones: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        }
    })
)

const PATIENT_QUERY = gql`
    query getClient($lab: Int!, $client: Int!, $patient: Int!){
        laboratory(lab: $lab){
            client(index: $client) {
                patient(index: $patient){
                    name
                    gender
                    toothColor
                    registrationDate
                    index
                }
            }
        }
    }
`;

const DELETE_MUTATION = gql`
    mutation delete($patient: Int!, $client: Int!, $lab: Int!){
        deletePatient(input: {
            client: $client
            lab: $lab
            index: $patient
        }) {
            ok
        }
    }
`

const LAB_QUERY = gql`
    {
        laboratory @client
    }
`;

type State = {
    dialogDelete: boolean,
}

export default function Details() {
    const classes = createTheme()
    const { client, patient } = useParams()
    const lab = useQuery(LAB_QUERY)
    const defaultState: State = {
        dialogDelete: false,
    }
    const { data, error, loading } = useQuery(
        PATIENT_QUERY,
        { variables: { lab: lab.data?.laboratory || 0, client, patient } }
    );
    const [deleteClient, deletion] = useMutation(DELETE_MUTATION)
    const [state, setState] = React.useState<State>(defaultState)
    const handleChange = (prop: keyof State, value: any) => () => {
        setState({ ...state, [prop]: value })
    }

    if (deletion.data?.deletePatient.ok) return (
        <Redirect to={`/client/${client}/patient/`} />
    )

    return (

        <Grid
            container
            alignItems="stretch"
            direction="column"
            className={classes.container}
        >
            <Grid item md={12}>
                <Card className={classes.card}>
                    <CardHeader
                        title={data?.laboratory.client.patient.name || (error && "Erro!")}
                    />
                    <Divider />
                    {!!data?.laboratory &&
                        < CardContent >
                            <Grid
                                container
                                direction="row"
                                justify="space-evenly"
                                alignItems="flex-start"
                                spacing={3}
                            >
                                <Grid item md>
                                    <Typography>
                                        Nome: {data?.laboratory.client.patient.name}
                                    </Typography>
                                </Grid>
                                {!!data?.laboratory.client.patient.toothColor &&
                                    <Grid item md>
                                        <Typography>
                                            Cor dos dentes: {data?.laboratory.client.patient.toothColor}
                                        </Typography>
                                    </Grid>
                                }
                                {!!data?.laboratory.client.patient.gender &&
                                    <Grid item md>
                                        <Typography>
                                            Gênero: {
                                                (data?.laboratory.client.patient.gender === 'M' && 'Masculino') ||
                                                (data?.laboratory.client.patient.gender === 'F' && 'Feminino')
                                            }
                                        </Typography>
                                    </Grid>
                                }
                            </Grid>
                        </CardContent>
                    }
                    {!!data?.laboratory &&
                        <CardActions>
                            <Button
                                onClick={handleChange('dialogDelete', true)}
                                color="secondary"
                            >Deletar</Button>
                            <Button
                                component={Link}
                                to={`/client/${client}/patient/${data?.laboratory.client.patient.index}/job/`}
                                variant="contained"
                                color="primary"
                            >Ver tabalhos</Button>
                        </CardActions>
                    }
                    {!!error &&
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {error?.message.split(':')[1]}
                            </Typography>
                        </CardContent>
                    }
                    <Dialog
                        open={state.dialogDelete}
                        onClose={handleChange('dialogDelete', false)}
                    >
                        <DialogTitle>Deletar?</DialogTitle>
                        <DialogContent>Tem certeza que deseja deletar o paciente {data?.laboratory.client.patient.name}?</DialogContent>
                        {!!deletion.loading &&
                            <CircularProgress />
                        }
                        <DialogActions>
                            <Button disabled={deletion.loading} onClick={handleChange('dialogDelete', false)} color="inherit">Cancelar</Button>
                            <Button disabled={deletion.loading} onClick={() => {
                                deleteClient({ variables: { lab: lab.data?.laboratory || 0, client, patient } })
                                    .then(() => handleChange('dialogDelete', false))
                            }} color="secondary">Deletar</Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={!!deletion.error}
                        autoHideDuration={6000}
                    >
                        <Alert severity="error">Erro ao deletar paciente! {deletion.error?.message}</Alert>
                    </Snackbar>
                </Card>
            </Grid>
        </Grid >
    )
}