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

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app.react';

const containerElementName = 'myReactComponentContainer';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `<div #${containerElementName}></div>`,
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnChanges, OnDestroy, AfterViewInit {
  title = 'web';
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  @Input() public counter = 10;
  @Output() public componentClick = new EventEmitter<void>();

  constructor() {
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

  private render() {
    ReactDOM.render(React.createElement(App), this.containerRef.nativeElement);
  }

}
