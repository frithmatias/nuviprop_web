// MODULOS DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DE ANGULAR MATERIAL
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// MODULOS PERSONALIZADOS
import { PipesModule } from '../pipes/pipes.module';

// DIRECTIVAS
import { NgDropFilesDirective } from '../directives/ng-drop-files.directive';

// COMPONENTES
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { UploaderComponent } from '../components/uploader/uploader.component';

// INICIO
import { MapaComponent } from '../components/mapa/mapa.component';
import { ListComponent } from './list/list.component';
import { CardsComponent } from './cards/cards.component';

// FORMULARIOS
import { PropiedadConfirmComponent } from './forms/propiedad-confirm/propiedad-confirm.component';
import { PropiedadDetallesComponent } from './forms/propiedad-detalles/propiedad-detalles.component';
import { PropiedadAvisoComponent } from './forms/propiedad-aviso/propiedad-aviso.component';
import { FiltrosComponent } from './forms/filtros/filtros.component';


@NgModule({
	declarations: [
		NgDropFilesDirective,
		IncrementadorComponent,
		UploaderComponent,
		MapaComponent,
		ListComponent,
		CardsComponent,
		PropiedadConfirmComponent,
		PropiedadDetallesComponent,
		PropiedadAvisoComponent,
		FiltrosComponent

	],
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		FormsModule,
		PipesModule,
		MatStepperModule,
		MatMenuModule,
		MatAutocompleteModule,
		MatInputModule,
		MatSelectModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatIconModule
	],
	exports: [
		IncrementadorComponent,
		UploaderComponent,
		MapaComponent,
		ListComponent,
		CardsComponent,
		RouterModule,
		PropiedadConfirmComponent,
		PropiedadDetallesComponent,
		PropiedadAvisoComponent,
		FiltrosComponent
	]
})
export class ComponentsModule { }
