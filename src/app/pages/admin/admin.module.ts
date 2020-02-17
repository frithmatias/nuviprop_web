import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulariosComponent } from './formularios/formularios.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from './usuarios/usuario.component';
import { PipesModule } from '../../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { ControlesComponent } from './controles/controles.component';
import { MatInputModule } from '@angular/material/input';


@NgModule({
	declarations: [FormulariosComponent, UsuarioComponent, ControlesComponent],
	imports: [
		CommonModule,
		MatSelectModule,
		MatSlideToggleModule,
		ReactiveFormsModule,
		PipesModule,
		RouterModule,
		MatInputModule
	]
})
export class AdminModule { }
