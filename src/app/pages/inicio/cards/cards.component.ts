import { Component, OnInit, HostListener } from '@angular/core';
import { InicioService } from '../inicio.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {



  constructor(private inicioService: InicioService) {

  }

  ngOnInit() {


  }


}
