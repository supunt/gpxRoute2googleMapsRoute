import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalDonateComponent } from './paypal-donate.component';



@NgModule({
  declarations: [PaypalDonateComponent],
  imports: [
    CommonModule
  ],
  exports: [PaypalDonateComponent]
})
export class PaypalDonateModule { }
