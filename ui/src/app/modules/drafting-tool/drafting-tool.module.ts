import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftingToolComponent } from './drafting-tool.component';
import { SharedModule } from '../shared/shared.module';
import { DraftingToolRoutingModule } from './drafting-tool-routing.module';

@NgModule({
  declarations: [DraftingToolComponent],
  imports: [
    CommonModule,
    SharedModule,
    DraftingToolRoutingModule
  ]
})
export class DraftingToolModule { }
