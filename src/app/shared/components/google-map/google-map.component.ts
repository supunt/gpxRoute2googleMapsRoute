import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { GoogleMapStateService } from './map-state.service';
import { MapsDarkTheme } from './dark_theme';
import { AgmMap } from '@agm/core';
import { BrowserLocationService } from '../../services/exports';
import { Guid } from '../../utils/guid';
import { GoogleMapMarker, GoogleWaypoint, LatLong } from '../../models/export';

declare var google: any;


@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  zoom = 8;
  viewport: any;
  darkTheme = MapsDarkTheme;
  waypoints: GoogleWaypoint[] = [];
  startingPoint: GoogleWaypoint = null;
  endingPoint: GoogleWaypoint = null;
  mapCenter: GoogleMapMarker = null;

  @ViewChild(AgmMap, {static : false}) map: AgmMap;
  @ViewChild(AgmMap, {static : false, read: ElementRef}) mapRef: ElementRef;

  constructor(private mapStateSvc: GoogleMapStateService, private locSvc: BrowserLocationService) { }

  // -------------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.CreateAndAddDefaultMarker();
  }

  // -------------------------------------------------------------------------------------------------------------------
  getDefaultMapCenter(): GoogleMapMarker {
    return this.mapCenter;
  }

  // -------------------------------------------------------------------------------------------------------------------
  updateMarkers(markers: GoogleMapMarker[]): void {
    this.waypoints = [];
    if (markers.length === 0) {
      this.CreateAndAddDefaultMarker();
    }
    else {
      for (const marker of markers) {
        this.waypoints.push( {
          location: marker
        });
      }
    }

    this.startingPoint = this.waypoints[0];
    this.endingPoint = this.waypoints[this.waypoints.length - 1];

    console.log('incomming waypoints', this.waypoints);
    this.map.triggerResize(true);
  }

  // -------------------------------------------------------------------------------------------------------------------
  private CreateAndAddDefaultMarker(): void {
    this.locSvc.getPosition().then(
      loc =>  {
        this.mapCenter = {
          lat: loc.lat,
          lng : loc.lng,
          draggable: true,
        };
      }
    );
  }

  // -------------------------------------------------------------------------------------------------------------------
  onMapReady(): void {
    this.mapStateSvc.setMapReady();
  }
}



