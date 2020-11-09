import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { MisAvisosComponent } from './misavisos/misavisos.component';
import { AvisoCrearComponent } from './aviso-crear/aviso-crear.component';
import { InmobiliariasComponent } from './inmobiliarias/inmobiliarias.component';
import { BuscarComponent } from './buscar/buscar.component';
import { LoginGuard, AdminGuard, TokenGuard } from '../services/services.index';
import { AvisosComponent } from './avisos/avisos.component';
import { AvisoComponent } from './aviso/aviso.component';
import { InicioComponent } from './inicio/inicio.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { FormulariosComponent } from './admin/formularios/formularios.component';
import { UsuarioComponent } from './admin/usuarios/usuario.component';
import { ControlesComponent } from './admin/controles/controles.component';

const pagesRoutes: Routes = [
  // TODO: Crear un módulo admin.module.ts para cargar con lazyload,
  // todos los comonentes de adminsitración juntos con canLoad.

  // PUBLIC PAGES
  { path: 'inicio', component: InicioComponent },
  { path: 'avisos', component: AvisosComponent },
  { path: 'aviso/:id', component: AvisoComponent },
  { path: 'buscar/:termino', component: BuscarComponent, data: { titulo: 'Buscador' } },

  // USER PAGES
  { path: 'account-settings', canActivate: [LoginGuard, TokenGuard], component: AccountSettingsComponent },
  { path: 'dashboard', canActivate: [LoginGuard, TokenGuard], component: DashboardComponent },
  { path: 'profile', canActivate: [LoginGuard, TokenGuard], component: ProfileComponent },
  { path: 'aviso-crear/:id', canActivate: [LoginGuard, TokenGuard], component: AvisoCrearComponent, data: { titulo: 'Agragar/Actualizar Aviso' } },
  { path: 'misavisos', canActivate: [LoginGuard, TokenGuard], component: MisAvisosComponent, data: { titulo: 'Mis Avisos' } },
  { path: 'favoritos', canActivate: [LoginGuard, TokenGuard], component: FavoritosComponent, data: { titulo: 'Favoritos' } },

  // ADMIN PAGES
  { path: 'usuarios/:id', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: UsuarioComponent, data: { titulo: 'Administracion de Usuarios' } },
  { path: 'usuarios', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: UsuariosComponent, data: { titulo: 'Administracion de Usuarios' } },
  { path: 'inmobiliarias', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: InmobiliariasComponent, data: { titulo: 'Administracion de Inmobiliarias' } },
  { path: 'forms', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: FormulariosComponent, data: { titulo: 'Controles de Formularios' } },
  { path: 'controles', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: ControlesComponent, data: { titulo: 'Agregar Controles de Formularios' } },
  { path: 'controles/:id', canActivate: [LoginGuard, TokenGuard, AdminGuard], component: ControlesComponent, data: { titulo: 'Editar Controles de Formularios' } },

  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];

// export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)], exports: [RouterModule]
})
export class PagesRoutingModule { }
