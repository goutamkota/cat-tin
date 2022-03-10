import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pos2Component } from './pos2.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Routes } from '@angular/router';
import { ReportsParamResolver } from '../reports/reports-param.resolver';

const routes: Routes = [
  {
    path: 'pos2',
    component: Pos2Component,
    resolve: { reportType: ReportsParamResolver }
  }
];

@NgModule({
  declarations: [Pos2Component],
  imports: [
    CommonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class Pos2Module { }
