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

// import Details from './details';

import CreateJob from './create';
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
    query patienta($patient: Int!, $lab: Int!, $client: Int!){
        laboratory(lab: $lab){
            client(index: $client){
                patient(index: $patient){
                    name
                    jobs{
                        price
                        kind{
                            name
                        }
                        deadline
                        index
                    }
                }
            }
        }
    }
`

export default function Jobs() {
    const classes = useStyles();
    const lab = useQuery(LAB_QUERY)
    const { client, patient, job } = useParams()
    const { data, refetch } = useQuery(PATIENTS_QUERY, {
        variables: { lab: (lab.data?.laboratory || 0), client, patient }
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
            title={`Trabalhos de ${data?.laboratory.client.patient.name}`}
            list={data?.laboratory.client.patient.jobs.map((item: any) => (
                <ListItem
                    button
                    component={Link}
                    to={`/client/${client}/patient/${patient}/job/${item.index}/`}
                    selected={job == item.index}
                >
                    <ListItemText
                        primary={item.name}
                    />
                </ListItem>
            ))}
            actions={
                <CreateJob onCreate={created} />
            }
        >
            {!!state.patient.index &&
                <Redirect to={`/client/${client}/patient/${state.patient.index}`} />
            }
            <Route path="/client/:client/patient/:patient/">
                {/* <Details /> */}
            </Route>
        </Works>
    )
}