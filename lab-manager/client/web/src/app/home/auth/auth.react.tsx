import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
    ViewEncapsulation,
    ElementRef,
    ViewChild,
    Component,
    OnInit
} from '@angular/core';

import {
    Grid,
    Container
} from '@material-ui/core';

const containerElementName = 'app';

@Component({
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AuthComponent implements OnInit {

    @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

    constructor() { }

    ngOnInit(): void {
        this.render()
    }

    render(): void {
        ReactDOM.render(React.createElement(() => {
            return (<Container
                maxWidth="sm"
                fixed
            >
                <Grid
                    item
                    xs={12}
                    justify="center"
                    alignItems="center"
                >
                    Olá mundo
                </Grid>
            </Container>
        )}), this.containerRef.nativeElement)
    }

}
