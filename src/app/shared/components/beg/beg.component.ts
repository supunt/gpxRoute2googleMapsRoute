import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-beg',
  templateUrl: './beg.component.html',
  styleUrls: ['./beg.component.scss']
})
export class BegComponent implements OnInit {

  public doBeg = environment.beg
  constructor() { 
  }

  ngOnInit(): void {
  }

}
