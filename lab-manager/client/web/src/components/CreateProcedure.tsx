import * as React from 'react';
import { Tooltip, IconButton, Icon, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, FormControlLabel, InputLabel, TextareaAutosize, Input } from '@material-ui/core';

import { Icon as MDI } from '@mdi/react';
import { mdiPlus } from '@mdi/js';

class State {
    dialog: boolean = false;
}

export default function CreateProcedure() {
    const [state, setState] = React.useState<State>(new State());
    const changeState = (prop: keyof State, value: any) => () => {
        setState({ ...state, [prop]: value })
    }

    return (
        <>
            <Tooltip title="Cadastrar Procedimento">
                <IconButton onClick={changeState('dialog', true)}>
                    <Icon component={MDI} path={mdiPlus} />
                </IconButton>
            </Tooltip>
            <Dialog onClose={changeState('dialog', false)} open={state.dialog}>
                <DialogTitle >Novo Procedimento</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item md={9}>
                            <TextField
                                fullWidth
                                label="Nome *"
                            />
                        </Grid>
                        <Grid item md={3}>
                            <TextField
                                fullWidth
                                label="Preço *"
                            />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                fullWidth
                                multiline
                                label="Descrição (opcional)"
                                variant="filled"
                                InputProps={{
                                    inputComponent: TextareaAutosize
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={changeState('dialog', false)}>Cancelar</Button>
                    <Button>Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}