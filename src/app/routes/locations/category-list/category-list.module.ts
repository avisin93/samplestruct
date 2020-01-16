import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { LocationCommonComponentsModule } from '../common/location-common-components.module';

const routes: Routes = [
    { path: '', component: CategoryListComponent }];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        LocationCommonComponentsModule
    ],
    declarations: [CategoryListComponent],
    exports: [
        RouterModule
    ]
})
export class CategoryListModule { }