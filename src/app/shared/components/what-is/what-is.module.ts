import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatIsComponent } from './what-is.component';



@NgModule({
  declarations: [WhatIsComponent],
  imports: [
    CommonModule
  ],
  exports: [WhatIsComponent]
})
export class WhatIsModule { }
