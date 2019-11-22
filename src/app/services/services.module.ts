import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SettingsService,
  SidebarService,
  UsuarioService,
  UploadFileService,
  ModalUploadService,
  PropiedadesService,
  InmobiliariaService
} from './services.index';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    SettingsService,
    SidebarService,
    UsuarioService,
    UploadFileService,
    ModalUploadService,
    PropiedadesService,
    InmobiliariaService
  ],
  declarations: []
})
export class ServiceModule {}
