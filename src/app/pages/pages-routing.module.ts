import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MisPropiedadesComponent } from './mispropiedades/mispropiedades.component';
import { PropiedadCrearComponent } from './mispropiedades/propiedad-crear/propiedad-crear.component';
import { InmobiliariasComponent } from './inmobiliarias/inmobiliarias.component';
import { BuscarComponent } from './buscar/buscar.component';
import { LoginGuard, AdminGuard, TokenGuard } from '../services/services.index';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { PropiedadVerComponent } from './mispropiedades/propiedad-ver/propiedad-ver.component';
import { InicioComponent } from './inicio/inicio.component';

const pagesRoutes: Routes = [
  // TODO: Crear un módulo admin.module.ts para cargar con lazyload,
  // todos los comonentes de adminsitración juntos con canLoad.

  // PUBLIC PAGES
  { path: 'inicio', component: InicioComponent },
  { path: 'propiedades', component: PropiedadesComponent },
  { path: 'buscar/:termino', component: BuscarComponent, data: { titulo: 'Buscador' } },
  { path: 'propiedadver/:id', component: PropiedadVerComponent },

  // USER PAGES
  { path: 'account-settings', canActivate: [LoginGuard, TokenGuard], component: AccountSettingsComponent },
  { path: 'dashboard', canActivate: [LoginGuard, TokenGuard], component: DashboardComponent },
  { path: 'profile', canActivate: [LoginGuard, TokenGuard], component: ProfileComponent },
  { path: 'propiedad/:id', canActivate: [LoginGuard, TokenGuard], component: PropiedadCrearComponent, data: { titulo: 'Agragar / Actualizar Propiedad' } },
  { path: 'mispropiedades', canActivate: [LoginGuard, TokenGuard], component: MisPropiedadesComponent, data: { titulo: 'Listado de Mis Propiedades' } },

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
