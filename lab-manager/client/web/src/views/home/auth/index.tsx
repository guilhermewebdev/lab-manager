import React from 'react';

import {
    createStyles,
    makeStyles,
    Theme,
    useTheme
} from '@material-ui/core/styles';
import {
    AppBar,
    Grid,
    Card,
    Tab,
    Tabs,
} from '@material-ui/core'

import SwipeableViews from 'react-swipeable-views';

import LoginForm from './Login'
import RegistrationForm from './Registration'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        form: {
            paddingTop: 15,
            paddingBottom: 25,
        },
        container: {
            height: "100%",
            marginTop: 15,
        },
        input: {
            marginBottom: 10,
        },
        button: {
            width: "100%"
        },
        margin: {
            margin: theme.spacing(1),
        },
        withoutLabel: {
            marginTop: theme.spacing(3),
        },
        textField: {
            width: '25ch',
        },
    }),
);

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
    dir?: string;
}

function a11yProps(index: any) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

export default function () {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    const theme = useTheme();
    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            spacing={10}
            className={classes.container}
        >
            <Grid item md={4}>
                <Card className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label="Entrar" {...a11yProps(0)} />
                            <Tab label="Cadastrar" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <LoginForm />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <RegistrationForm />
                        </TabPanel>
                    </SwipeableViews>
                </Card>
            </Grid>
        </Grid>
    )
}