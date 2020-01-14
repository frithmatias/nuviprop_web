import { Component, OnInit, Input } from '@angular/core';
import { AvisosService } from '../../pages/avisos/avisos.service';
import { Aviso } from 'src/app/models/aviso.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() avisos: Aviso[] = [];

  constructor(private avisosService: AvisosService) { }

  ngOnInit() {
  }

}
