import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { PropiedadCrearComponent } from './propiedades/propiedad-crear/propiedad-crear.component';
import { InmobiliariasComponent } from './inmobiliarias/inmobiliarias.component';
import { BuscarComponent } from './buscar/buscar.component';
import { LoginGuard, AdminGuard, TokenGuard } from '../services/services.index';
import { ResultadosComponent } from './resultados/resultados.component';
import { PropiedadVerComponent } from './propiedades/propiedad-ver/propiedad-ver.component';
import { InicioComponent } from './inicio/inicio.component';

const pagesRoutes: Routes = [
  // TODO: Crear un módulo admin.module.ts para cargar con lazyload,
  // todos los comonentes de adminsitración juntos con canLoad.

  // PUBLIC PAGES
  { path: 'inicio', component: InicioComponent },
  { path: 'resultados', component: ResultadosComponent },

  { path: 'buscar/:termino', component: BuscarComponent, data: { titulo: 'Buscador' } },
  { path: 'propiedadver/:id', component: PropiedadVerComponent },

  // LOGIN PAGES
  { path: 'account-settings', canActivate: [LoginGuard, TokenGuard], component: AccountSettingsComponent },
  { path: 'dashboard', canActivate: [LoginGuard, TokenGuard], component: DashboardComponent },
  { path: 'profile', canActivate: [LoginGuard, TokenGuard], component: ProfileComponent },

  // ADMIN PAGES
  { path: 'usuarios', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: UsuariosComponent, data: { titulo: 'Administracion de Usuarios' } },
  { path: 'propiedades', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: PropiedadesComponent, data: { titulo: 'Administracion de Propiedades' } },
  { path: 'propiedad/:id', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: PropiedadCrearComponent, data: { titulo: 'Actualizar Propiedad' } },
  { path: 'inmobiliarias', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: InmobiliariasComponent, data: { titulo: 'Administracion de Inmobiliarias' } },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

// export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)], exports: [RouterModule]
})
export class PagesRoutingModule { }
