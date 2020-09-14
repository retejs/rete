import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReteModule } from '@naetverkjs/angular-renderer';

import { AppComponent } from './app.component';
import { ReteComponent } from './rete/rete.component';
import { NumberComponent } from './rete/controls/number-control';
import { MyNodeComponent } from './rete/components/node/node.component';

@NgModule({
  declarations: [AppComponent, ReteComponent, NumberComponent, MyNodeComponent],
  imports: [BrowserModule, ReteModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NumberComponent, MyNodeComponent],
})
export class AppModule {}
