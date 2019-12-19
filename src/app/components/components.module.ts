// MODULOS DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// MODULOS DE ANGULAR MATERIAL
import { MatStepperModule } from '@angular/material/stepper';

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

@NgModule({
  declarations: [
    NgDropFilesDirective,
    FormComponent,
    IncrementadorComponent,
    MapaComponent,
    // ModalUploadComponent, --> lo importo desde app.module.ts porque esta oculto en toda la web.
    UploaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    MatStepperModule
  ],
  exports: [
    FormComponent,
    IncrementadorComponent,
    MapaComponent,
    UploaderComponent
  ]
})
export class ComponentsModule { }
