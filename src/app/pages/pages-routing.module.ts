import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MisAvisosComponent } from './misavisos/misavisos.component';
import { AvisoCrearComponent } from './misavisos/aviso-crear/aviso-crear.component';
import { InmobiliariasComponent } from './inmobiliarias/inmobiliarias.component';
import { BuscarComponent } from './buscar/buscar.component';
import { LoginGuard, AdminGuard, TokenGuard } from '../services/services.index';
import { AvisosComponent } from './avisos/avisos.component';
import { AvisoVerComponent } from './misavisos/aviso-ver/aviso-ver.component';
import { InicioComponent } from './inicio/inicio.component';

const pagesRoutes: Routes = [
  // TODO: Crear un módulo admin.module.ts para cargar con lazyload,
  // todos los comonentes de adminsitración juntos con canLoad.

  // PUBLIC PAGES
  { path: 'inicio', component: InicioComponent },
  { path: 'avisos', component: AvisosComponent },
  { path: 'buscar/:termino', component: BuscarComponent, data: { titulo: 'Buscador' } },
  { path: 'avisover/:id', component: AvisoVerComponent },

  // USER PAGES
  { path: 'account-settings', canActivate: [LoginGuard, TokenGuard], component: AccountSettingsComponent },
  { path: 'dashboard', canActivate: [LoginGuard, TokenGuard], component: DashboardComponent },
  { path: 'profile', canActivate: [LoginGuard, TokenGuard], component: ProfileComponent },
  { path: 'aviso/:id', canActivate: [LoginGuard, TokenGuard], component: AvisoCrearComponent, data: { titulo: 'Agragar / Actualizar Aviso' } },
  { path: 'misavisos', canActivate: [LoginGuard, TokenGuard], component: MisAvisosComponent, data: { titulo: 'Listado de Mis Avisos' } },

  // ADMIN PAGES
  { path: 'usuarios', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: UsuariosComponent, data: { titulo: 'Administracion de Usuarios' } },
  { path: 'inmobiliarias', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: InmobiliariasComponent, data: { titulo: 'Administracion de Inmobiliarias' } },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

// export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)], exports: [RouterModule]
})
export class PagesRoutingModule { }
