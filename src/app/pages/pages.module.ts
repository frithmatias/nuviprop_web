import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// MODULOS DE ANGULAR MATERIAL
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// MODULOS PERSONALIZADOS
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';

// COMPONENTES
import { BuscarComponent } from './buscar/buscar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AvisosComponent } from './avisos/avisos.component';
import { InmobiliariasComponent } from './inmobiliarias/inmobiliarias.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgressComponent } from './progress/progress.component';
import { MisAvisosComponent } from './misavisos/misavisos.component';
import { AvisoCrearComponent } from './misavisos/aviso-crear/aviso-crear.component';
import { AvisoVerComponent } from './misavisos/aviso-ver/aviso-ver.component';
import { AccountSettingsComponent } from './settings/settings.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
	declarations: [
		DashboardComponent,
		ProgressComponent,
		AccountSettingsComponent,
		ProfileComponent,
		UsuariosComponent,
		MisAvisosComponent,
		AvisoCrearComponent,
		InmobiliariasComponent,
		BuscarComponent,
		AvisosComponent,
		AvisoVerComponent,
		InicioComponent


	],
	exports: [DashboardComponent],
	imports: [
		PipesModule,
		ComponentsModule,
		CommonModule,
		PagesRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		MatStepperModule,
		MatFormFieldModule,
		MatIconModule,
		MatMenuModule,
		MatAutocompleteModule,
		MatInputModule,
		MatSelectModule,
		MatProgressSpinnerModule

	]
})
export class PagesModule { }
