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
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Snackbar,
    CircularProgress,
    Box,
    Paper,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ExpansionPanelActions,
    BoxProps,
    Container,
} from '@material-ui/core';

import { useParams, Redirect } from 'react-router';
import { Link } from 'react-router-dom'

import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';

import { Alert } from '@material-ui/lab';

import Jobs from '../jobs/index';
import { ExpandMore } from '@material-ui/icons';


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

type Props = {
    onDelete: Function,
}

const fullBoxProperties: BoxProps = {
    display: 'flex',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flex: '1 1 0',
    flexDirection: 'column',
}

const createTheme = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            height: "100%",
            width: "100%",
        },
        subheader: {
        }
    })
)

export default function Details(props: Props) {
    const classes = createTheme()
    const { client, patient } = useParams()
    const lab = useQuery(LAB_QUERY)
    const defaultState: State = {
        dialogDelete: false,
    }
    const { data, error, refetch, loading } = useQuery(
        PATIENT_QUERY,
        { variables: { lab: lab.data?.laboratory || 0, client, patient } }
    );
    const [deleteClient, deletion] = useMutation(DELETE_MUTATION)
    const [state, setState] = React.useState<State>(defaultState)
    const handleChange = (prop: keyof State, value: any) => () => {
        setState({ ...state, [prop]: value })
    }

    if (deletion.data?.deletePatient.ok) {
        props.onDelete()
        return (
            <Redirect to={`/client/${client}/patient/`} />
        )
    }

    return (
        <>
            <Paper className={classes.paper} square elevation={3}>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1c-content"
                        id="panel1c-header"
                    >
                        <Typography variant="h5">{data?.laboratory.client.patient.name || (error && "Erro!")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="flex-start"
                            spacing={3}
                            className={classes.subheader}
                        >
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
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions>
                        <Button
                            onClick={handleChange('dialogDelete', true)}
                            color="secondary"
                        >Deletar</Button>

                    </ExpansionPanelActions>
                </ExpansionPanel>
                <Box
                    {...fullBoxProperties}
                >
                    {!!data?.laboratory &&
                        <Jobs onCreateJob={refetch} />
                    }
                    {!!error &&
                        <Typography variant="body2" color="textSecondary" component="p">
                            {error?.message.split(':')[1]}
                        </Typography>
                    }
                </Box>
            </Paper>
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
        </>

    )
}