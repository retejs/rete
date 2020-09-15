import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NaetverkModule } from '@naetverkjs/angular-renderer';

import { AppComponent } from './app.component';
import { NaetverkComponent } from './naetverk/naetverk.component';
import { NumberComponent } from './naetverk/controls/number-control';
import { MyNodeComponent } from './naetverk/components/node/node.component';

@NgModule({
  declarations: [AppComponent, NaetverkComponent, NumberComponent, MyNodeComponent],
  imports: [BrowserModule, NaetverkModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NumberComponent, MyNodeComponent],
})
export class AppModule {}
