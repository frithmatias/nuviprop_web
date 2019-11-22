import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Módulos personalizados
import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { PropiedadComponent } from './propiedades/propiedad.component';
import { InmobiliariasComponent } from './inmobiliarias/inmobiliarias.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    IncrementadorComponent,
    AccountSettingsComponent,
    ProfileComponent,
    UsuariosComponent,
    PropiedadesComponent,
    ModalUploadComponent,
    PropiedadComponent,
    InmobiliariasComponent
  ],
  exports: [DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule,
    PipesModule
  ]
})
export class PagesModule {}
