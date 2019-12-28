import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'capitalizarPipe'
})
export class CapitalizarPipe implements PipeTransform {
	/*
	FORMA NUEVA
	transform(value: string, arg1, arg2, arg3): string {

	FORMA ANTERIOR
	transform(value: string, args: any[]): string {

	si quiero utilizar la forma anterior puedo usar el operador REST ("...")
	transform(value: string, ...args: any[]): string {

	en la ultima version de angular, los args ya no vienen en un array
	vienen separados por comas arg1,arg2,arg3,argN...
	*/
	transform(value: string, todas: boolean = true): string {
		value = value.toLowerCase();
		const nombres = value.split(' ');
		if (todas) {
			for (const i in nombres) {
				nombres[i] = nombres[i][0].toUpperCase() + nombres[i].substr(1); // .substr(1) concateno desde la primera posición en adelante
			}
		} else {
			nombres[0] = nombres[0][0].toUpperCase() + nombres[0].substr(1); // .substr(1) concateno desde la primera posición en adelante
		}
		// console.log(args);
		return nombres.join(' ');
	}
}
