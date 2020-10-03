import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapStateService {

  public $mapState: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  constructor() { }

  setMapReady(): void {
    this.$mapState.next(true);
  }
}
