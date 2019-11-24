import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { PropiedadComponent } from './propiedades/propiedad.component';
import { InmobiliariasComponent } from './inmobiliarias/inmobiliarias.component';
import { BuscarComponent } from './buscar/buscar.component';
import { LoginGuard, AdminGuard, TokenGuard } from '../services/services.index';

const pagesRoutes: Routes = [
  // TODO: Crear un módulo admin.module.ts para cargar con lazyload,
  // todos los comonentes de adminsitración juntos con canLoad.
  { path: 'dashboard', canActivate: [TokenGuard], component: DashboardComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'account-settings', component: AccountSettingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: { titulo: 'Administracion de Usuarios' } },
  { path: 'inmobiliarias', canActivate: [AdminGuard], component: InmobiliariasComponent, data: { titulo: 'Administracion de Inmobiliarias' } },
  { path: 'propiedades', canActivate: [AdminGuard], component: PropiedadesComponent, data: { titulo: 'Administracion de Propiedades' } },
  { path: 'propiedad/:id', component: PropiedadComponent, data: { titulo: 'Actualizar Propiedad' } },
  { path: 'buscar/:termino', component: BuscarComponent, data: { titulo: 'Buscador' } },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

// export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)], exports: [RouterModule]
})
export class PagesRoutingModule { }
