import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BegComponent } from './beg.component';
import { PaypalDonateModule } from '../paypal-donate/paypal-donate.module';



@NgModule({
  declarations: [BegComponent],
  imports: [
    CommonModule,
    PaypalDonateModule
  ],
  exports: [BegComponent]
})
export class BegModule { }
