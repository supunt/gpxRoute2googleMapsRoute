import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { NgbModule, NgbDateAdapter, NgbDateParserFormatter, NgbTimeAdapter, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerAdapter, DatepickerParserFormatter, TimepickerAdapter } from './shared/elements/exports';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HomeModule,
    SharedModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    {
     provide: NgbDateAdapter, useClass: DatepickerAdapter
    },
    {
      provide: NgbDateParserFormatter, useClass: DatepickerParserFormatter
    },
    {
      provide: NgbTimeAdapter, useClass: TimepickerAdapter
    },
    NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
