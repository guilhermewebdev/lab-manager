import * as React from 'react'

import {
    Theme,
    makeStyles,
    createStyles,
    ListItem,
    Modal,
} from '@material-ui/core'

import Works from '../../../../components/Works';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';


import CreateClient from './create';

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

const CLIENTS_QUERY = gql`
    query clients($lab: Int!){
        laboratory(lab: $lab){
            clients {
                name
                index
                telephones {
                    telephone
                }
            }
        }
    }
`

type ClientsState = {
}

export default function Clients() {
    const classes = useStyles();
    const lab = useQuery(LAB_QUERY)
    const { data } = useQuery(CLIENTS_QUERY, {
        variables: { lab: (lab.data?.laboratory || 0) }
    })
    const initalState: ClientsState = {
    }
    const [state, setState] = React.useState<ClientsState>(initalState)
    const changeState = (prop: keyof ClientsState, value: any) => () => {
        setState({ ...state, [prop]: value })
    }

    return (
        <Works
            title="Dentistas"
            list={data?.data?.laboratory.client.map((item: any) => (
                <ListItem button>{item.name}</ListItem>
            ))}
            actions={
                <CreateClient />
            }
        >
            teste
        </Works>
    )
}