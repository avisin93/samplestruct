// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { LexiconRoutingModule } from './lexicon-routing.module';

// Components
import { LexiconComponent } from './lexicon.component';
import { AddEditLexiconComponent } from './add-edit-lexicon/add-edit-lexicon.component';
import { UploadLexiconListComponent } from './add-edit-lexicon/upload-lexicon-list.component';

// import { AddEditExelaProductComponent } from "./add-edit-exela-product/add-edit-exela-product.component";
// import { ExelaProductMenuSetupComponent } from "./add-edit-exela-product/exela-product-menu/exela-product-menu-setup.component";
// import { AddEditExelaProductMenuComponent } from "./add-edit-exela-product/exela-product-menu/add-edit-exela-product-menu/add-edit-exela-product-menu.component";
// import { ExelaProductInformationComponent } from "./add-edit-exela-product/exela-product-information/exela-product-information.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MaterialModule,
    LexiconRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ],
  declarations: [
    LexiconComponent,
    AddEditLexiconComponent,
    UploadLexiconListComponent
    // ExelaProductInformationComponent,
    // ExelaProductMenuSetupComponent,
    // AddEditExelaProductMenuComponent
  ],
  exports: [
    LexiconComponent
  ],
  entryComponents: [
    AddEditLexiconComponent,
    UploadLexiconListComponent
  ],
  providers: [
  ]
})
export class LexiconModule { }
