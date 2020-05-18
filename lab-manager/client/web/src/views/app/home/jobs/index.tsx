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
    Zoom,
} from '@material-ui/core'

import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

// import Details from './details';

import { Icon as MDI } from '@mdi/react';

import CreateJob from './create';
import { useParams } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100%',
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
        },
        toolbar: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
            flexGrow: 0,
        },
        container: {
            height: "100%",
            flexGrow: 1,
            position: 'relative',
        },
        list: {
            paddingTop: 0,
        },
        tableRow: {
            // '&:nth-of-type(odd)': {
            //     backgroundColor: theme.palette.action.focus,
            // },
        },
        tableContainer: {
            flex: "1 1 auto"
        },
        tableBody: {
            overflowY: 'auto',
            flex: '1 1 auto'
        }
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
        format: (value) => new Date(value).toLocaleString('pt-br'),
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
        format: (value: number) => value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
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
            elevation={3}
            className={classes.root}
            square
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
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.tableContainer} stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            {columns.map((column: Column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    size="small"
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {data?.laboratory.client.patient.jobs.map((job: any, index: number) => (
                            <Slide
                                in={true}
                                direction="left"
                                style={{ transformOrigin: '0 0 0' }}
                                {...(true ? { timeout: index * 100 } : {})}
                                key={job.index}
                            >

                                <TableRow
                                    hover
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
                                                {!!column.format ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </Slide>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}