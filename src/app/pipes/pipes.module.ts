// Este módulo lo voy a consumir desde el header, módulo SHARED, y desde modulo PAGES.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';

@NgModule({
    declarations: [ImagenPipe],
    imports: [CommonModule],
    exports: [ImagenPipe]
})
export class PipesModule {}
