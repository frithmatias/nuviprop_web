import { Component, OnInit } from '@angular/core';
import { MisAvisosService } from '../misavisos/misavisos.service';
import { Avisos, Aviso } from 'src/app/models/aviso.model';

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

  cargarMisFavoritos(){
    this.misAvisosService.cargarMisFavoritos(0).subscribe((favoritos: Avisos) => {
      this.favoritos = favoritos.avisos;
      console.log(this.favoritos);
    })
  }
}
