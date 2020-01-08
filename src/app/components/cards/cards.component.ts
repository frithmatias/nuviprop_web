import { Component, OnInit, Input } from '@angular/core';
import { Propiedad } from 'src/app/models/propiedad.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Input() propiedades: Propiedad[] = [];

  constructor() { }
  ngOnInit() {
  }

}
