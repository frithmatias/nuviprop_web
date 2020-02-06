import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


// MODULOS PERSONALIZADOS
import { ComponentsModule } from '../components/components.module';
import { PagesModule } from '../pages/pages.module';
import { PipesModule } from '../pipes/pipes.module';

// COMPONENTES
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';


// MATERIAL FOR FILTERS MENU

@NgModule({
    imports: [
        RouterModule, 
        CommonModule, 
        PipesModule, 
        PagesModule, 
        ComponentsModule
    ],
    declarations: [
        NopagefoundComponent,
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent
    ],
    exports: [
        NopagefoundComponent,
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent
    ]
})
export class SharedModule { }
