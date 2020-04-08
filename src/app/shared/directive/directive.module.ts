import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebounceClickDirective } from './debounce-click.directive';
import { HorizontalScrollDirective } from './horizontal-scroll.directive';

@NgModule({
  declarations: [
    DebounceClickDirective,
    HorizontalScrollDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DebounceClickDirective,
    HorizontalScrollDirective,
  ]
})
export class DirectiveModule { }
