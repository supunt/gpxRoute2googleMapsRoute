import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapModule } from './google-map/google-map.module';
import { LoaderModule } from './loader/loader.module';
import { PaypalDonateModule } from './paypal-donate/paypal-donate.module';
import { HeaderModule } from './header/header.module';
import { AlertModule } from './alert/alert.module';
import { BegModule } from './beg/beg.module';
import { WhatIsModule } from './what-is/what-is.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    GoogleMapModule,
    LoaderModule,
    PaypalDonateModule,
    HeaderModule,
    AlertModule,
    BegModule,
    WhatIsModule
]
})
export class ComponentsModule { }
