export interface LatLong {
  lat: number;
  lng: number;
}

// -------------------------------------------------------------------------------------------------------------------
export interface GoogleMapMarker extends LatLong {
  uuid?: string;
  draggable: boolean;
}

// -------------------------------------------------------------------------------------------------------------------
export interface GoogleWaypoint {
  location: GoogleMapMarker;
}

// -------------------------------------------------------------------------------------------------------------------
export interface UsersMarker extends GoogleMapMarker {
  saved: boolean;
}

// -------------------------------------------------------------------------------------------------------------------
export interface GoolgPlacePrediction {
  description: string;
  place_id: string;
}
