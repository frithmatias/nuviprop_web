import { Component, OnInit } from '@angular/core';
import { MisAvisosService } from '../misavisos/misavisos.service';
import { Avisos, Aviso } from 'src/app/models/aviso.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {

  constructor(private misAvisosService: MisAvisosService) { }
  favoritos: Aviso[];
  ngOnInit() {
    this.cargarMisFavoritos();
  }

  cargarMisFavoritos() {
    const usuario: Usuario = JSON.parse(localStorage.getItem('usuario'));
    const strAvisos = usuario.favoritos.toString();
    if (strAvisos.length === 0) {
      return;
    }
    this.misAvisosService.cargarMisFavoritos(0, strAvisos).subscribe((favoritos: Avisos) => {
      this.favoritos = favoritos.avisos;
      console.log(this.favoritos);
    })
  }
}
