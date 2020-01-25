import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsAdminComponent } from './forms-admin/forms-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FormsAdminComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
