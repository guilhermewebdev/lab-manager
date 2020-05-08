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
    Slide,
} from '@material-ui/core'

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
        <Slide direction={value === 1? 'left':'right'} in={value === index}>
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                {...other}
            >
                {children}
            </div>
        </Slide>
    );
}

export default function () {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    const theme = useTheme();

    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            className={classes.container}
        >
            <Grid item md={4}>
                <Card>
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
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <LoginForm />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <RegistrationForm />
                    </TabPanel>
                </Card>
            </Grid>
        </Grid>
    )
}