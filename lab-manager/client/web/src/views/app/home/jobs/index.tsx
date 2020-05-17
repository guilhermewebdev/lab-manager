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
    List,
    Grid,
    GridList,
    GridListTile,
    ListSubheader,
    Typography,
    Divider,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Toolbar,
    Tooltip,
    IconButton,
    Icon,
    Paper,
} from '@material-ui/core'

import Works from '../../../../components/Works';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

// import Details from './details';

import { Icon as MDI } from '@mdi/react';

import CreateJob from './create';
import { Route, useParams, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { mdiPlus } from '@mdi/js';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxHeight: '100%',
        },
        toolbar: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
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
        tableRow: {
            // '&:nth-of-type(odd)': {
            //     backgroundColor: theme.palette.action.focus,
            // },
        },
    }),
);

const LAB_QUERY = gql`
        {
            laboratory @client
        }
    `

const JOBS_QUERY = gql`
    query patienta($patient: Int!, $lab: Int!, $client: Int!){
        laboratory(lab: $lab){
            client(index: $client){
                patient(index: $patient){
                    name
                    jobs {
                        price
                        amount
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

interface Column {
    id: 'price' | 'amount' | 'kind' | 'deadline' | 'index';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => string;
}

const columns: Column[] = [
    {
        id: 'kind',
        label: 'Tipo',
        format: (value) => value.name
    },
    {
        id: 'deadline',
        label: 'Previsão de entrega',
        format: (value) => String(new Date(value).toLocaleString()),
        align: 'center',
    },
    {
        id: 'amount',
        label: 'Quantidade',
        align: 'center',
    },
    {
        id: 'price',
        label: 'Valor Total',
        format: (value) => `R$${value}`
    }
]

type Props = {
    onCreateJob?: (job: any) => void;
}

export default function Jobs(props: Props) {
    const classes = useStyles();
    const lab = useQuery(LAB_QUERY)
    const { client, patient } = useParams()
    const { data, refetch } = useQuery(JOBS_QUERY, {
        variables: { lab: (lab.data?.laboratory || 0), client, patient }
    })
    const [state, setState] = React.useState<any>({
        job: {}
    })
    const created = (newJob: any) => {
        refetch().then(() => {
            setState({ job: newJob })
            props.onCreateJob && props.onCreateJob(newJob)
        })
    }

    return (
        <Paper
            elevation={5}
            className={classes.root}
        >
            <Toolbar
                variant="dense"
                className={classes.toolbar}
            >
                <Typography variant="h6" id="tableTitle" component="div">
                    Trabalhos
                </Typography>
                <CreateJob onCreate={created} />
            </Toolbar>
            <TableContainer>
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            {columns.map((column: Column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.laboratory.client.patient.jobs.map((job: any) => (
                            <TableRow
                                hover
                                key={job.index}
                                tabIndex={-1}
                                className={classes.tableRow}
                            >
                                {columns.map((column: Column) => {
                                    const value = job[column.id];

                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            variant="body"
                                            size="medium"
                                        >
                                            {column.format && typeof value !== 'number' ? column.format(value) : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}