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

import Details from './details';

import CreateClient from './create';
import { Route, useParams } from 'react-router';
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
    const { client } = useParams()

    return (
        <Works
            title="Dentistas"
            list={data?.laboratory.clients.map((item: any) => (
                <ListItem
                    button
                    component={Link}
                    to={`/client/${item.index}/`}
                    selected={client == item.index}
                >
                    <ListItemText
                        primary={item.name}
                        secondaryTypographyProps={{
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
            <Route path="/client/:client/">
                <Details />
            </Route>
        </Works>
    )
}