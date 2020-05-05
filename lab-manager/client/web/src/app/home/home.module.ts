import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AuthComponent } from './auth/auth.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [HomeComponent, AuthComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatTabsModule
  ]
})
export class HomeModule { }
