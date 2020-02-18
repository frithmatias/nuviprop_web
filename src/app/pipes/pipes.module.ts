// Este módulo lo voy a consumir desde el header, módulo SHARED, y desde modulo PAGES.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
import { CapitalizarPipe } from './capitalizar.pipe';
import { RolePipe } from './role.pipe';
import { PricekPipe } from './pricek.pipe';

@NgModule({
	declarations: [ImagenPipe, CapitalizarPipe, RolePipe, PricekPipe],
	imports: [CommonModule],
	exports: [ImagenPipe, CapitalizarPipe, RolePipe, PricekPipe]
})
export class PipesModule { }
