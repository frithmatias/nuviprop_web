import { Component, OnInit, Inject } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MisAvisosService } from '../misavisos/misavisos.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, filter } from 'rxjs/operators';
import { ScriptsService } from 'src/app/services/scripts.service';
export interface DialogData {
	animal: string;
	name: string;
}

@Component({
	selector: 'app-aviso',
	templateUrl: './aviso.component.html',
	styleUrls: ['./aviso.component.scss']

})
export class AvisoComponent implements OnInit {
	parsetemplate = false; // con *ngIf cargo el templete sólo cuando ya tengo la data
	aviso: Aviso;
	anunciante: Usuario;
	id: string;
	scriptloaded = false;
	constructor(
		private scriptsService: ScriptsService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private misAvisosService: MisAvisosService,
		public dialog: MatDialog) { }

	ngOnInit() {
		$.getScript('../assets/fotorama/fotorama.dev.js');
		// this.scriptsService.load('fotorama').then(data => {
		// 	console.log('script loaded ', data);
		// 	this.scriptloaded = true;
		// }).catch(error => console.log('script load error: ', error));

		document.body.scrollTop = 0; // Safari
		document.documentElement.scrollTop = 0; // Other

		this.activatedRoute.params.subscribe(async params => {
			this.id = params.id;
			await this.cargarAviso(this.id).then(() => {
				this.parsetemplate = true;
			});
		});
	}



	openDialog(): void {
		const dialogRef = this.dialog.open(AvisoModalComponent, {
			height: '90%',
			width: '450px',
			data: this.aviso
		});

		// Me puedo subscribir y obtener data desde el modal
		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
			console.log(result);
		});
	}

	cargarAviso(id: string) {
		return new Promise((resolve, reject) => {
			this.misAvisosService.obtenerAviso(id).subscribe((aviso: Aviso) => {
				this.aviso = aviso;
				console.log(this.aviso);
				// this.files = aviso.imgs;
				resolve();
			});

		});
	}
}

@Component({
	selector: 'app-aviso-modal',
	templateUrl: 'aviso-modal.html',
})
export class AvisoModalComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<AvisoModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {}

	ngOnInit(){
		$.getScript('../assets/fotorama/fotorama.dev.js');

	}
	onNoClick(): void {
		this.dialogRef.close();
	}

}