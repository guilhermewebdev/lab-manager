import * as React from 'react';
import { Grow, Card, Grid, CardContent, CardHeader, Divider, makeStyles, Theme, createStyles, Typography } from '@material-ui/core';
import { useParams } from 'react-router';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

const createTheme = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: 1000
        },
        card: {
            height: 1000
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

const LAB_QUERY = gql`
    {
        laboratory @client
    }
`;

export default function Details() {
    const classes = createTheme()
    const { client } = useParams()
    const lab = useQuery(LAB_QUERY)
    const { data, error, loading } = useQuery(
        CLIENT_QUERY,
        { variables: { lab: lab.data?.laboratory || 0, client } }
    );
    
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
                        title={data?.laboratory.client.name}
                    />
                    <Divider />
                    <CardContent>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="baseline"
                            spacing={5}
                        >
                            <Grid item md={4}>
                                <Typography>
                                    Nome: {data?.laboratory.client.name}
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography>
                                    Endereço: {data?.laboratory.client.address}
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography>
                                    E-mail: {data?.laboratory.client.email}
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography>
                                    Desconto: {data?.laboratory.client.discount}
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography>
                                    Telephones: {data?.laboratory.client.telephones.map((tel: any) => tel.telephone)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}