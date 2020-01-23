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
import { MatListModule } from '@angular/material/list';

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
import { ConfirmComponent } from './forms/confirm/confirm.component';
import { DetallesComponent } from './forms/detalles/detalles.component';
import { AvisoComponent } from './forms/aviso/aviso.component';
import { FiltrosComponent } from './forms/filtros/filtros.component';
import { NewformsComponent } from './forms/newforms/newforms.component';


@NgModule({
	declarations: [
		NgDropFilesDirective,
		IncrementadorComponent,
		UploaderComponent,
		MapaComponent,
		ListComponent,
		CardsComponent,
		ConfirmComponent,
		DetallesComponent,
		AvisoComponent,
		FiltrosComponent,
		NewformsComponent

	],
	imports: [
		PipesModule,
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		FormsModule,
		MatStepperModule,
		MatMenuModule,
		MatAutocompleteModule,
		MatInputModule,
		MatSelectModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatIconModule,
		MatListModule
	],
	exports: [
		IncrementadorComponent,
		UploaderComponent,
		MapaComponent,
		ListComponent,
		CardsComponent,
		RouterModule,
		ConfirmComponent,
		DetallesComponent,
		AvisoComponent,
		FiltrosComponent,
		NewformsComponent
	]
})
export class ComponentsModule { }
