import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SettingsService,
  SidebarService,
  UsuarioService,
  UploaderService,
  ModalUploadService,
  MisPropiedadesService,
  InmobiliariaService,
  LoginGuard,
  AdminGuard,
  TokenGuard,
  PropiedadesService,
  MapaService,
  FormsService
} from './services.index';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
	SettingsService,
	SidebarService,
	UsuarioService,
	UploaderService,
	ModalUploadService,
	MisPropiedadesService,
	InmobiliariaService,
	LoginGuard,
	AdminGuard,
	TokenGuard,
	PropiedadesService,
	MapaService,
	FormsService
  ],
  declarations: []
})
export class ServiceModule { }
