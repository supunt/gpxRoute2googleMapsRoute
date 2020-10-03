import { SafeResourceUrl } from '@angular/platform-browser';

export interface GpxRoot {
  rte: GpxRoute[];
}

export interface GpxRoute {
  name: string[];
  desc: string[];
  src: string[];
  link: string[];
  number: number[];
  type: string[];
  rtept: GpxWayPoint[];
}

export interface GpxRouteDisplay extends GpxRoute {
  routeSegments: GpxWayPoint[][];
  segmentUris: UriSegment[];
}

export interface UriSegment {
  embedUri: SafeResourceUrl;
  mapsUri: string;
}
export interface GpxWayPoint {
  $: GpxLatLon;
  desc: string[];
  name: string[];
}

export interface GpxLatLon {
  lat: string;
  lon: string;
}
