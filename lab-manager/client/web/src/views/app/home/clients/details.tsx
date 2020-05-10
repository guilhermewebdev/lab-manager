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

const CLIENT_QUERY = gql`
    query getClient($lab: Int!, $client: Int!){
        laboratory(lab: $lab){
            client(index: $client) {
                name
                address
                email
                registrationDate
                index
                discount
                telephones {
                    telephone
                }
            }
        }
    }
`;

const DELETE_MUTATION = gql`
    mutation delete($client: Int!, $lab: Int!){
        deleteClient(input: {
            index: $client
            lab: $lab
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
    const { client } = useParams()
    const lab = useQuery(LAB_QUERY)
    const defaultState: State = {
        dialogDelete: false,
    }
    const { data, error, loading } = useQuery(
        CLIENT_QUERY,
        { variables: { lab: lab.data?.laboratory || 0, client } }
    );
    const [deleteClient, deletion] = useMutation(DELETE_MUTATION)
    const [state, setState] = React.useState<State>(defaultState)
    const handleChange = (prop: keyof State, value: any) => () => {
        setState({ ...state, [prop]: value })
    }

    if (deletion.data?.deleteClient.ok) return (
        <Redirect to="/" />
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
                        title={data?.laboratory.client.name || (error && "Erro!")}
                    />
                    <Divider />
                    {!!data?.laboratory &&
                        < CardContent >
                            <Grid
                                container
                                direction="row"
                                justify="space-evenly"
                                alignItems="baseline"
                                spacing={3}
                            >
                                <Grid item md>
                                    <Typography>
                                        Nome: {data?.laboratory.client.name}
                                    </Typography>
                                </Grid>
                                {!!data?.laboratory.client.email &&
                                    <Grid item md>
                                        <Typography>
                                            E-mail: {data?.laboratory.client.email}
                                        </Typography>
                                    </Grid>
                                }
                                {!!data?.laboratory.client.discount &&
                                    <Grid item md>
                                        <Typography>
                                            Desconto: {data?.laboratory.client.discount}%
                                    </Typography>
                                    </Grid>
                                }
                                {!!data?.laboratory.client.address &&
                                    <Grid item md>
                                        <Typography>
                                            Endereço: {data?.laboratory.client.address}
                                        </Typography>
                                    </Grid>
                                }
                                {!!data?.laboratory.client.telephones &&
                                    <Grid item className={classes.telephones} md={12}>
                                        <Typography>
                                            Telephones:
                                </Typography>

                                        {data?.laboratory.client.telephones.map((tel: any) => (
                                            <Chip
                                                label={tel.telephone}
                                            />
                                        ))}
                                    </Grid>
                                }
                            </Grid>
                            <Divider />
                        </CardContent>
                    }
                    {!!data?.laboratory &&
                        <CardActions>
                            <Button onClick={handleChange('dialogDelete', true)} color="secondary">Deletar</Button>
                            <Button component={Link} to={`/client/${data?.laboratory.client.index}/patient/`} variant="contained" color="primary">Ver pacientes</Button>
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
                        <DialogContent>Tem certeza que deseja deletar o cliente {data?.laboratory.client.name}?</DialogContent>
                        {!!deletion.loading &&
                            <CircularProgress />
                        }
                        <DialogActions>
                            <Button disabled={deletion.loading} onClick={handleChange('dialogDelete', false)} color="inherit">Cancelar</Button>
                            <Button disabled={deletion.loading} onClick={() => {
                                deleteClient({ variables: { lab: lab.data?.laboratory || 0, client } })
                                    .then(() => handleChange('dialogDelete', false))
                            }} color="secondary">Deletar</Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={!!deletion.error}
                        autoHideDuration={6000}
                    >
                        <Alert severity="error">Erro ao deletar cliente! {deletion.error?.message}</Alert>
                    </Snackbar>
                </Card>
            </Grid>
        </Grid >
    )
}