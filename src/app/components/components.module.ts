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

// MODULOS PERSONALIZADOS
import { PipesModule } from '../pipes/pipes.module';

// DIRECTIVAS
import { NgDropFilesDirective } from '../directives/ng-drop-files.directive';

// COMPONENTES
import { FormComponent } from './form/form.component';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { MapaComponent } from '../components/mapa/mapa.component';
// import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { UploaderComponent } from '../components/uploader/uploader.component';
import { FormConfirmComponent } from './form-confirm/form-confirm.component';
import { ListComponent } from './list/list.component';
import { CardsComponent } from './cards/cards.component';

@NgModule({
  declarations: [
    NgDropFilesDirective,
    IncrementadorComponent,
    UploaderComponent,
    FormComponent,
    FormConfirmComponent,
    MapaComponent,
    ListComponent,
    CardsComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    MatStepperModule,
    MatMenuModule,
    MatAutocompleteModule,
    RouterModule
  ],
  exports: [
    IncrementadorComponent,
    UploaderComponent,
    FormComponent,
    FormConfirmComponent,
    MapaComponent,
    ListComponent,
    CardsComponent,
    RouterModule
  ]
})
export class ComponentsModule { }
