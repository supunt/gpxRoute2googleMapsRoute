import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import xml2js from 'xml2js';
import { GoogleMapComponent } from '../shared/components/google-map/google-map.component';
import { AlertService, GoogleMapMarker, GpxRoute, GpxRouteDisplay, GpxWayPoint } from '../shared/export';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public selectedFile = null;
  public parserError = null;
  public parserWarning = null;
  public routesInfile: GpxRoute[] = [];
  public routesDisplay: GpxRouteDisplay[] = [];
  private rootUrl = 'https://www.google.com/maps/dir';
  public androidAutoMode = false

  public lastLoadedfileData = null;
  public selectedRow = -1;
  public expandedRow = -1;
  public selectedSubRow = -1;
  public showAndroidAutoDoc = false


  @ViewChild(GoogleMapComponent, { static: false }) gmapElement: GoogleMapComponent;
  @ViewChild('displayLabel', { static: false, read: ElementRef }) displayLabel: ElementRef;

  constructor(private sanitizer: DomSanitizer, private alertSvc: AlertService) { }

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

  toggleAndroidAuto($event): void {
    this.routesDisplay = [];
    this.routesInfile = [];
    this.androidAutoMode = !this.androidAutoMode;
  }

  // -------------------------------------------------------------------------------------------------------------------
  toggleCollapse(e: Event, rowIndex: number) {
    if (this.expandedRow == rowIndex) {
      this.expandedRow = -1
    } else {
      this.expandedRow = rowIndex
    }
    this.rowSelected(rowIndex, 0, e)
    
    e.stopPropagation()
  }

  // -------------------------------------------------------------------------------------------------------------------
  toggleAndroidAutoDoc() : void{
    this.showAndroidAutoDoc = !this.showAndroidAutoDoc    
  }


  // -------------------------------------------------------------------------------------------------------------------
  collapseRow(rowIndex: number) : void{
    this.expandedRow = rowIndex    
  }

  // -------------------------------------------------------------------------------------------------------------------
  expandRow(rowIndex: number) : void{
    this.expandedRow = rowIndex 
    this.selectedRow = rowIndex;
    this.selectedSubRow = 0
  }

  // -------------------------------------------------------------------------------------------------------------------
  rowSelected(rowIndex: number, segment: number, e: Event): void {
    this.expandRow(rowIndex)
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
    e.stopPropagation()

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
    this.alertSvc.info('Link Copied', {autoClose:true})
    event.stopPropagation();
  }

  // -------------------------------------------------------------------------------------------------------------------
  goToLink(url, event){
    window.open(url, "_blank");
    event.stopPropagation();
  }

  // -------------------------------------------------------------------------------------------------------------------
  parseFile(inputValue: any): void {
    this.parserError = null;
    this.parserWarning = null;
    const file: File = inputValue.files[0];
    if (inputValue.files.length === 0) {
      return;
    }

    this.displayLabel.nativeElement.innerHTML = inputValue.files[0].name;
    console.log(inputValue.files[0].name);

    const fileNameSplits = inputValue.files[0].name.split('.');
    const fileType = fileNameSplits[fileNameSplits.length - 1].toLowerCase();

    if (fileType !== 'gpx' && fileType !== 'xmp') {
      this.parserError = 'We support .gpx and .xml (that share .gpx schema) files only';
      return;
    }

    this.routesInfile = [];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.lastLoadedfileData = myReader.result;
    };

    myReader.readAsText(file);
  }

  // -------------------------------------------------------------------------------------------------------------------
  public processFile(): void {
    this.parserError = null;
    this.parserWarning = null;
    this.routesDisplay = [];
    this.routesInfile = [];
    this.collapseRow(-1) 

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

                  if (i > 0) {
                    newObj.routeSegments[i] = item.rtept.slice(sectionStart - 1, sectionEnd);
                  } else {
                    newObj.routeSegments[i] = item.rtept.slice(sectionStart, sectionEnd);
                  }

                  newObj.segmentUris.push({
                    mapsUri: this.generateMapsUri(newObj.routeSegments[i]),
                    embedUri: this.generateEmbedUri(newObj.routeSegments[i])
                  });
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
        } else {
          this.parserWarning = 'We did not find any routes in your gpx file';
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

    let urlConstruct = `https://www.google.com/maps/embed?pb=!1m${coords.length * 4 + 16}`;
    urlConstruct += `!1m12!1m3!1d1.0!2d${coords[0].$.lon}!3d${coords[0].$.lon}`;
    urlConstruct += `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`;
    urlConstruct += `!4m${coords.length * 4 + 1}!3e0${coordinateString}`;
    urlConstruct += `!5e0!3m2!1sen!2sau!4v${epochNow}000!5m2!1sen!2sau`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(urlConstruct);
  }

  // -------------------------------------------------------------------------------------------------------------------
  private generateMapsUri(coords: GpxWayPoint[]): string {

    let splitUrl = this.rootUrl;

    if (this.androidAutoMode) {
      splitUrl += '/'
    }

    for (const coord of coords) {
        splitUrl += `/${coord.$.lat},${coord.$.lon}`;
    }

    return splitUrl;
  }
}
