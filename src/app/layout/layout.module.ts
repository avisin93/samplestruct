/**
* Component     : Layout
* Author        : Boston Byte LLC
* Creation Date : 22nd May 2018
*/

import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { OffsidebarComponent } from './offsidebar/offsidebar.component';
import { UserblockComponent } from './sidebar/userblock/userblock.component';
import { UserblockService } from './sidebar/userblock/userblock.service';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { RolePermission } from '../shared/role-permission';
import { LayoutService } from './layout.service';
import { LayoutData } from './layout.data';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(dashboardRoutes),
    ],
    providers: [
        UserblockService,
        RolePermission,
        LayoutService,
        LayoutData
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        UserblockComponent,
        HeaderComponent,
        NavsearchComponent,
        OffsidebarComponent,
        FooterComponent
    ],
    exports: [
        RouterModule
    ]
})
export class LayoutModule { }
