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
import { UploaderComponent } from '../components/uploader/uploader.component';

// INICIO
import { MapaComponent } from '../components/mapa/mapa.component';
import { ListComponent } from './list/list.component';
import { CardsComponent } from './cards/cards.component';

// FORMULARIOS
import { ConfirmComponent } from '../pages/aviso-crear/confirm/confirm.component';
import { AvisoComponent } from '../pages/aviso-crear/aviso/aviso.component';
import { DetallesComponent } from '../pages/aviso-crear/detalles/detalles.component';



@NgModule({
	declarations: [
		NgDropFilesDirective,
		UploaderComponent,
		MapaComponent,
		ListComponent,
		CardsComponent,
		ConfirmComponent,
		AvisoComponent,
		DetallesComponent

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
		MatIconModule
		],
	exports: [
		UploaderComponent,
		MapaComponent,
		ListComponent,
		CardsComponent,
		RouterModule,
		ConfirmComponent,
		AvisoComponent,
		DetallesComponent
	]
})
export class ComponentsModule { }
