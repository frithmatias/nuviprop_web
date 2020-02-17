import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
	name: 'rolePipe'
})
@Injectable({
	providedIn: 'root' // Only available with angular 6+, else add it to providers
})
export class RolePipe implements PipeTransform {

	transform(role: string): any {
		if (!role || typeof role !== 'string') {
			//console.log('Ingreso un valor no string al PIPE de capitalización.');
			return;
		}
		let resp: string;
		switch (role) {
			case 'ADMIN_ROLE':
				resp = 'Administrador';
				break;

			case 'USER_ROLE':
				resp = 'Usuario';
				break;
		}
		return resp;
	}

}
