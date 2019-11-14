import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';

import { SharedModule } from '../shared/shared.module';


import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { FormsModule } from '@angular/forms';
import { AccountSettingsComponent } from './account-settings/account-settings.component';




@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        IncrementadorComponent,
        AccountSettingsComponent
    ],
    exports: [
        DashboardComponent

    ],
    imports: [
        SharedModule,
        PagesRoutingModule,
        FormsModule
    ]
})
export class PagesModule { }

