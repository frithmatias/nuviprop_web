import { Component, OnInit } from '@angular/core';
import { InicioService } from '../inicio.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private inicioService: InicioService) { }

  ngOnInit() {
  }

}
