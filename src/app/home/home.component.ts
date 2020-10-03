import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import xml2js from 'xml2js';
import { GoogleMapComponent } from '../shared/components/google-map/google-map.component';
import { GoogleMapMarker, GpxRoute, GpxRouteDisplay, GpxWayPoint } from '../shared/export';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public selectedFile = null;
  public parserError = null;
  public routesInfile: GpxRoute[] = [];
  public routesDisplay: GpxRouteDisplay[] = [];
  private rootUrl = 'https://www.google.com/maps/dir';

  private lastLoadedfileData = null;
  public selectedRow = -1;
  public selectedSubRow = -1;


  @ViewChild(GoogleMapComponent, { static: false }) gmapElement: GoogleMapComponent;
  @ViewChild('displayLabel', { static: false, read: ElementRef }) displayLabel: ElementRef;

  constructor(private sanitizer: DomSanitizer) { }

  // -------------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
  }

  // -------------------------------------------------------------------------------------------------------------------
  changeListener($event): void {
    this.parseFile($event.target);
  }

  // -------------------------------------------------------------------------------------------------------------------
  clearSelection($event): void {
    $event.target.value = null;
  }

  // -------------------------------------------------------------------------------------------------------------------
  rowSelected(rowIndex: number, segment: number): void {
    this.selectedRow = rowIndex;
    this.selectedSubRow = segment;
    const selectedroute = this.routesDisplay[rowIndex];
    console.log('selectedroute', selectedroute);

    const coordinates: GoogleMapMarker[] = selectedroute.routeSegments[segment].map(x => { return {
      lat: parseFloat(x.$.lat),
      lng: parseFloat(x.$.lon),
      draggable: false
      };
    });

    console.log(this.routesDisplay[this.selectedRow].segmentUris[this.selectedSubRow])

    // this.gmapElement.updateMarkers(coordinates);
  }

  // -------------------------------------------------------------------------------------------------------------------
  copyLinkToClipboard(url, event): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    event.stopPropagation();
  }

  // -------------------------------------------------------------------------------------------------------------------
  parseFile(inputValue: any): void {
    this.routesInfile = [];
    const file: File = inputValue.files[0];
    if (inputValue.files.length === 0) {
      return;
    }

    this.displayLabel.nativeElement.innerHTML = inputValue.files[0].name;
    const fileType = inputValue.parentElement.id;

    const myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.lastLoadedfileData = myReader.result;
    };

    myReader.readAsText(file);
  }

  // -------------------------------------------------------------------------------------------------------------------
  public processFile(): void {
    this.parserError = null;
    const parser = new xml2js.Parser(
      {
        trim: true,
        explicitArray: true
      });

    const segmentSize = 20;
    parser.parseString(this.lastLoadedfileData,
      (err, result) => {
        if (err != null) {
          this.parserError = err.toString().split('Char:')[0].trim();
          return;
        }

        const gpxObj = result.gpx;

        if ('rte' in gpxObj) {
          console.log('routesInfile', gpxObj);
          this.routesInfile = gpxObj.rte;

          for (const item of this.routesInfile) {
            const newObj = {} as GpxRouteDisplay;
            Object.assign(newObj, item);
            newObj.segmentUris = [];
            newObj.routeSegments = [];

            if (item.rtept.length > segmentSize) {
              const remainder = item.rtept.length % segmentSize;
              let splitCount = (item.rtept.length - remainder) / segmentSize;
              if (remainder > 0) {
                splitCount += 1;
              }

              for (let i = 0; i < splitCount; i++)
              {
                  const sectionStart = i * segmentSize;
                  const sectionEnd = Math.min(((i + 1) * segmentSize), item.rtept.length);
                  const slicedCoords = [];
                  for (let j = sectionStart; j < sectionEnd; j++)
                  {
                      slicedCoords.push(item.rtept[j]);
                  }

                  newObj.segmentUris.push({
                    mapsUri: this.generateMapsUri(slicedCoords),
                    embedUri: this.generateEmbedUri(slicedCoords)
                  });

                  if (i > 0) {
                    newObj.routeSegments[i] = item.rtept.slice(sectionStart - 1, sectionEnd);
                  } else {
                    newObj.routeSegments[i] = item.rtept.slice(sectionStart, sectionEnd);
                  }
                }
            } else {
              newObj.routeSegments = [item.rtept];
              newObj.segmentUris.push({
                mapsUri: this.generateMapsUri(item.rtept),
                embedUri: this.generateEmbedUri(item.rtept)
              });
            }
            this.routesDisplay.push(newObj);
          }

          console.log('routesDisplay', this.routesDisplay);
        }


      });
  }

  // -------------------------------------------------------------------------------------------------------------------
  private generateEmbedUri(coords: GpxWayPoint[]): SafeResourceUrl {

    let coordinateString = '';
    for (const item of coords) {
      coordinateString += '!4m3!3m2!1d' + item.$.lat + '!2d' + item.$.lon;
    }

    const epochNow = Date.now();

    const urlConstruct =
      `https://www.google.com/maps/embed?pb=!1m${coords.length * 4 + 16}!1m12
      !1m3!1d1.0!2d${coords[0].$.lon}!3d${coords[0].$.lon}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1
      !4m${coords.length * 4 + 1}!3e0${coordinateString}!5e0!3m2!1sen!2sau!4v${epochNow}000!5m2!1sen!2sau`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(urlConstruct);
  }

  // -------------------------------------------------------------------------------------------------------------------
  private generateMapsUri(coords: GpxWayPoint[]): string {

    let splitUrl = this.rootUrl;
    for (const coord of coords) {
        splitUrl += `/${coord.$.lat},${coord.$.lon}`;
    }

    return splitUrl;
  }
}
