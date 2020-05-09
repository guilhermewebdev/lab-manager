import * as React from 'react'

import {
    Theme,
    makeStyles,
    createStyles,
    ListItem,
    Modal,
    ListItemText,
    Box,
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
            name
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

export default function Clients() {
    const classes = useStyles();
    const lab = useQuery(LAB_QUERY)
    const { data, refetch } = useQuery(CLIENTS_QUERY, {
        variables: { lab: (lab.data?.laboratory || 0) }
    })

    return (
        <Works
            title="Dentistas"
            list={data?.laboratory.clients.map((item: any) => (
                <ListItem
                    button
                >
                    <ListItemText
                        primary={item.name}
                        secondaryTypographyProps={{
                            paragraph: false,
                            noWrap: true,
                        }}
                        secondary={item.telephones
                            .map((tel: any) => `${tel.telephone}; `)
                            .reduce(((accum: string, tel: string) => (accum + tel)))
                        }
                    />
                </ListItem>
            ))}
            actions={
                <CreateClient onCreate={refetch} />
            }
        >
            {data?.laboratory.name}
        </Works>
    )
}