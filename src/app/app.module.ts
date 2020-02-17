import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// RUTAS
import { AppRoutingModule } from './app-routing.module';

// MODULOS PERSONALIZADOS
import { ServiceModule } from './services/services.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PipesModule } from '../app/pipes/pipes.module';

// COMPONENTES
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PagesComponent } from './pages/pages.component';

// ANGULAR MATERIAL
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
	declarations: [AppComponent, LoginComponent, RegisterComponent, PagesComponent],
	// Si queda clavado en LOADING... es posible que este alterado el orden de la importación de módulos
	// verificar que el módulo de las páginas se importe ANTES que el módulo de las rutas.
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		ServiceModule,
		SharedModule,
		BrowserAnimationsModule,
		PipesModule,
		MatInputModule,
		MatIconModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
