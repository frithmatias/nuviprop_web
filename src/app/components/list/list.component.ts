import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MisAvisosService } from 'src/app/services/services.index';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	cargando = false;
	pagina = 0;
	totalAvisos = 0;
	@Input() avisos: Aviso[] = [];
	@Output() avisosChange: EventEmitter<Aviso[]> = new EventEmitter<Aviso[]>();

	constructor(
		private misAvisosService: MisAvisosService
	) { }

	ngOnInit() {
	}

	ngOnChanges(changes: any){

	}

	borrarAviso(aviso: Aviso) {
		Swal.fire({
			// para evitar problemas de tipo en este metodo defino al prinicio, declare var swal: any;
			title: 'Esta seguro?',
			text: 'Esta a punto de borrar ' + aviso.tipoinmueble + ' en ' + aviso.calle + ' ' + aviso.altura,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Si, borrar aviso.'
		}).then(result => {
			if (result.value) {
				this.cargando = true;
				this.misAvisosService
					.borrarAviso(aviso._id)
					.subscribe((resp: any) => {
						Swal.fire(
							'Aviso eliminado',
							'La aviso ha sido borrada con éxito.',
							'success'
						);
						this.avisos = this.avisos.filter(avisolista => {
							return avisolista._id !== aviso._id;
						})
						this.cargando = false;
					});
			} else {
			}
		});
	}

	activarAviso(id: string) {
		this.misAvisosService.activarAviso(id).subscribe((data: Aviso) => {
			this.avisos.forEach(aviso => {
				if (aviso._id === data._id) {
					aviso.activo = data.activo;
				}
			})
		});
	}

	destacarAviso(id: string) {
		this.misAvisosService.destacarAviso(id).subscribe((data: Aviso) => {
			this.avisos.forEach(aviso => {
				if (aviso._id === data._id) {
					aviso.destacado = data.destacado;
					// A diferencia de activar/desactivar avisos, este metodo tiene que actualizar un dato que debe 
					// verse reflejado en un componente "hermano" por lo tanto tengo que avisarle al "padre" que hubo 
					// cambios para que les envíe a todos los "hijos" los cambios, en este caso en avisos[].
					// En los hijos, voy a observar los cambios con el ciclo de control de cambios ngOnChanges(){}.

					this.avisosChange.emit(this.avisos);
				}
			})
		});
	}



}
