import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-what-is',
  templateUrl: './what-is.component.html',
  styleUrls: ['./what-is.component.scss']
})
export class WhatIsComponent implements OnInit {

  public doBeg = environment.beg
  constructor() { }

  ngOnInit(): void {
  }

}
