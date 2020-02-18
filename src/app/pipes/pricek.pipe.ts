import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
	name: 'pricekPipe'
})

@Injectable({
	providedIn: 'root' // Only available with angular 6+, else add it to providers
})
export class PricekPipe implements PipeTransform {

	transform(price: number): any {
		if (!price || typeof price !== 'number') {
			return;
		}

		let resp: string;
		if (price > 10000) {
			resp = String(Math.round(price / 1000)) + 'k';
		} else {
			resp = String(price);
		}
		return resp;
	}

}
