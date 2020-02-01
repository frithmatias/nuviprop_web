import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { LoginGuard, TokenGuard } from './services/services.index';

const appRoutes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {	path: '',	        component: PagesComponent,
	// canActivate: [LoginGuard, TokenGuard],
	loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule)
	// en network voy a ver ahora que solo cuando hago un LOGIN veo pages-pages-module.js
	// loadChildren: './pages/pages.module#PagesModule'
  },
  { path: '**',     component: NopagefoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
