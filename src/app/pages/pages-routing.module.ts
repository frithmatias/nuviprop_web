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

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'account-settings', component: AccountSettingsComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Administracion de Usuarios' }
      },
      {
        path: 'inmobiliarias',
        component: InmobiliariasComponent,
        data: { titulo: 'Administracion de Inmobiliarias' }
      },
      {
        path: 'propiedades',
        component: PropiedadesComponent,
        data: { titulo: 'Administracion de Propiedades' }
      },
      {
        path: 'propiedad/:id',
        component: PropiedadComponent,
        data: { titulo: 'Actualizar Propiedad' }
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];

// export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
@NgModule({
  imports: [RouterModule.forRoot(pagesRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
