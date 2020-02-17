// Este módulo lo voy a consumir desde el header, módulo SHARED, y desde modulo PAGES.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
import { CapitalizarPipe } from './capitalizar.pipe';
import { RolePipe } from './role.pipe';

@NgModule({
    declarations: [ImagenPipe, CapitalizarPipe, RolePipe],
    imports: [CommonModule],
    exports: [ImagenPipe, CapitalizarPipe, RolePipe]
})
export class PipesModule { }
