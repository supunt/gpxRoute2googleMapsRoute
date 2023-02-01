import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paypal-donate',
  templateUrl: './paypal-donate.component.html',
  styleUrls: ['./paypal-donate.component.scss']
})
export class PaypalDonateComponent implements OnInit {

  @Input() showDetails = true;
  constructor() { }

  ngOnInit(): void {
  }

}
