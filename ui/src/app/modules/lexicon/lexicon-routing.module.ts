// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LexiconComponent } from './lexicon.component';
import { AddEditLexiconComponent } from './add-edit-lexicon/add-edit-lexicon.component';
import { LexiconService } from './lexicon.service';

// Components

const routes: Routes = [
  {
    path: '',
    component: LexiconComponent
  },
  {
    path: 'add',
    component: AddEditLexiconComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditLexiconComponent,
    data: {
      mode: 'edit'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    LexiconService
  ]
})
export class LexiconRoutingModule { }
