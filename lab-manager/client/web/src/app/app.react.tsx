import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


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


import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
  } from '@angular/core';
  
//   import * as React from 'react';
  import * as ReactDOM from 'react-dom';
//   import { App } from './app.react';
  import { Router } from '@angular/router';
  
  const containerElementName = 'myReactComponentContainer';
  
  @Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    template: `
    <div #${containerElementName}></div>
    <router-outlet></router-outlet>  
    `,
    encapsulation: ViewEncapsulation.None,
  })
  
  export class AppComponent implements OnChanges, OnDestroy, AfterViewInit {
    title = 'web';
    @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;
  
    @Input() public counter = 10;
    @Output() public componentClick = new EventEmitter<void>();
  
    constructor(public router: Router) {
      this.handleDivClicked = this.handleDivClicked.bind(this);
    }
  
    public handleDivClicked() {
      if (this.componentClick) {
        this.componentClick.emit();
        this.render();
      }
    }
  
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
        const classes = useStyles();

        return (
          <div className={classes.root}>
            <AppBar color="primary" position="fixed">
              <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  News
                </Typography>
                <Button onClick={ this.toAuth }>Login</Button>
              </Toolbar>
            </AppBar>
          </div>
        );
    }), this.containerRef.nativeElement);
    }
  
  }
  