import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import {
    AfterViewInit,
    Component,
    ElementRef,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';


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
    }),
);



const containerElementName = 'app';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnChanges, OnDestroy, AfterViewInit {
    title = 'Gerenciador de laboratório';

    @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

    constructor(public router: Router) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.render();
    }

    ngAfterViewInit() {
        this.render();
    }

    ngOnDestroy() {
        ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
    }

    toAuth = () => this.router.navigate(['/auth'])

    private render() {
        ReactDOM.render(React.createElement(() => {
            const [drawer, setDrawer] = React.useState(false)
            const toggleDrawer = (open: boolean) => setDrawer(open);
            const classes = useStyles();

            return (
                <div className={classes.root}>
                    <AppBar color="primary" position="static">
                        <Toolbar variant="dense">
                            <IconButton
                                onClick={() => toggleDrawer(true)}
                                edge="start" className={classes.menuButton}
                                color="inherit"
                                aria-label="menu"
                            >
                                <MenuIcon />
                            </IconButton>
                            <SwipeableDrawer
                                anchor='left'
                                open={drawer}
                                onClose={() => toggleDrawer(false)}
                                onOpen={() => toggleDrawer(true)}
                            >
                                Olá mundo {drawer}
                            </SwipeableDrawer>
                            <div className="spacer"></div>
                            <Button onClick={this.toAuth}>Login</Button>
                        </Toolbar>
                    </AppBar>
                </div>
            );
        }), this.containerRef.nativeElement);
    }

}
