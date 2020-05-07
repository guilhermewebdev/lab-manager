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
    FormGroup,
    TextField,
    Switch,
    Button,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core'

import SwipeableViews from 'react-swipeable-views';

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
            paddingTop: 10,
            paddingBottom: 10,
        },
        button: {
            width: "100%"
        }
    }),
);

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
    dir?: string;
}


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

function LoginForm() {
    const classes = useStyles();
    return (
        <form autoComplete="off" className={classes.form}>
            <Grid
                container
                justify="center"
                alignItems="center"
            >
                <Grid item md={11}>
                    <FormGroup>
                        <TextField className={classes.input} label="Nome de usuário"></TextField>
                        <TextField className={classes.input} label="Senha"></TextField>
                        <FormControlLabel className={classes.input} control={<Switch color="primary" />} label="Manter Conectado" />
                    </FormGroup>
                </Grid>
                <Grid item md={11}>
                    <Button className={classes.button} variant="contained" color="primary">
                        Entrar
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

function RegisterForm(){
    const classes = useStyles();
    return (
        <form autoComplete="off" className={classes.form}>
            <Grid
                container
                justify="center"
                alignItems="center"
            >
                <Grid item md={11}>
                    <FormGroup>
                        <TextField className={classes.input} label="Nome completo"></TextField>
                        <TextField className={classes.input} label="Email"></TextField>
                        <TextField className={classes.input} label="Nome de usuário"></TextField>
                        <TextField className={classes.input} label="Senha"></TextField>
                        <TextField className={classes.input} label="Confirme sua senha"></TextField>
                        <TextField className={classes.input} label="Nome do laboratório"></TextField>
                        <FormControlLabel className={classes.input} control={<Checkbox color="primary" />} label="Concordo com os termos de uso" />
                    </FormGroup>
                </Grid>
                <Grid item md={11}>
                    <Button className={classes.button} variant="contained" color="primary">
                        Cadastrar
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
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
            <Grid item md={5}>
                <Card className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Entrar" {...a11yProps(0)} />
                            <Tab label="Cadastrar" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <LoginForm />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <RegisterForm />
                        </TabPanel>
                    </SwipeableViews>
                </Card>
            </Grid>
        </Grid>
    )
}