import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCustomElement } from '@angular/elements';

import { KebabPipe } from './kebab.pipe';
import { NodeComponent } from './node/node.component';
import { SocketComponent } from './socket/socket.component';
import { ControlDirective } from './control.directive';
import { SocketDirective } from './socket.directive';
import { CustomComponent } from './custom.component';

@NgModule({
  declarations: [
    NodeComponent,
    SocketComponent,
    CustomComponent,
    ControlDirective,
    SocketDirective,
    KebabPipe,
  ],
  imports: [CommonModule],
  providers: [KebabPipe, ControlDirective],
  exports: [
    NodeComponent,
    CustomComponent,
    SocketComponent,
    ControlDirective,
    SocketDirective,
    KebabPipe,
  ],
  entryComponents: [NodeComponent, SocketComponent, CustomComponent],
})
export class NaetverkModule {
  constructor(injector: Injector) {
    // StaticInjectorError due to 'npm link'
    const CustomElement = createCustomElement(CustomComponent, { injector });
    if (!customElements.get('rete-element'))
      customElements.define('rete-element', CustomElement);
  }
}
