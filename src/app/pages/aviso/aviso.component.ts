import { Component, OnInit } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MisAvisosService } from '../misavisos/misavisos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.scss']

})
export class AvisoComponent implements OnInit {
  parsetemplate = false; // con *ngIf cargo el templete sólo cuando ya tengo la data
  aviso: Aviso;
  id: string;
  constructor(private activatedRoute: ActivatedRoute, private misAvisosService: MisAvisosService) { }

  ngOnInit() {
	document.body.scrollTop = 0; // Safari
	document.documentElement.scrollTop = 0; // Other

	this.activatedRoute.params.subscribe(async params => {
		this.id = params.id;
		await this.cargarAviso(this.id).then(() => {
		this.parsetemplate = true;
		});
	});
  }

  cargarAviso(id: string) {
	return new Promise((resolve, reject) => {
		this.misAvisosService.obtenerAviso(id).subscribe((aviso: Aviso) => {
		this.aviso = aviso;
		// this.files = aviso.imgs;
		resolve();
		});

	});
  }
}
