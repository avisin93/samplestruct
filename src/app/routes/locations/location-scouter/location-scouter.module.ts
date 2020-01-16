import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationScouterComponent } from './location-scouter.component';
import { SharedModule } from '@app/shared/shared.module';
import { LocationScouterService } from './location-scouter.service';
const routes: Routes = [
    { path: '', component: LocationScouterComponent },
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
    providers: [LocationScouterService],
    declarations: [LocationScouterComponent],
    exports: [
        RouterModule
    ]
})
export class LocationScouterModule { }
