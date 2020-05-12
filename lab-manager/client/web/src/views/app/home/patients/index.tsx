import * as React from 'react'

import {
    Theme,
    makeStyles,
    createStyles,
    ListItem,
    Modal,
    ListItemText,
    Box,
    Slide,
    Grow,
} from '@material-ui/core'

import Works from '../../../../components/Works';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

import  Details from './details';

import CreatePatient from './create';
import { Route, useParams, Redirect } from 'react-router';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: "100%",
            flexGrow: 1,
            position: 'relative',
        },
        list: {
            paddingTop: 0,
        },
        card: {
            overflow: 'auto',
            height: "100%",
        },

    }),
);

const LAB_QUERY = gql`
        {
            laboratory @client
        }
    `

const PATIENTS_QUERY = gql`
    query clients($lab: Int!, $client: Int!){
        laboratory(lab: $lab){
            client(index: $client){
                name
                patients {
                    index
                    name
                }
            }
        }
    }
`

export default function Patients() {
    const classes = useStyles();
    const lab = useQuery(LAB_QUERY)
    const { client, patient } = useParams()
    const { data, refetch } = useQuery(PATIENTS_QUERY, {
        variables: { lab: (lab.data?.laboratory || 0), client }
    })
    const [state, setState] = React.useState<any>({
        patient: {}
    })
    const created = (newPatient: any) => {
        refetch().then(() =>
            setState({ patient: newPatient })
        )
    }

    return (
        <Works
            title={`Pacitentes de ${data?.laboratory.client.name}`}
            list={data?.laboratory.client.patients.map((item: any) => (
                <ListItem
                    button
                    component={Link}
                    to={`/client/${client}/patient/${item.index}/`}
                    selected={patient == item.index}
                >
                    <ListItemText
                        primary={item.name}
                    />
                </ListItem>
            ))}
            actions={
                <CreatePatient onCreate={created} />
            }
        >
            {!!state.patient.index &&
                <Redirect to={`/client/${state.client.index}/`} />
            }
            <Route path="/client/:client/patient/:patient/">
                <Details onDelete={refetch} />
            </Route>
        </Works>
    )
}