import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SettingsService,
  SidebarService,
  UsuarioService,
  UploaderService,
  ModalUploadService,
  MisAvisosService,
  InmobiliariaService,
  LoginGuard,
  AdminGuard,
  TokenGuard,
  AvisosService,
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
    MisAvisosService,
    InmobiliariaService,
    LoginGuard,
    AdminGuard,
    TokenGuard,
    AvisosService,
    FormsService
  ],
  declarations: []
})
export class ServiceModule { }
