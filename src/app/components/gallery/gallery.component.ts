import { Component, OnInit, Input } from '@angular/core';
import { Avisos } from 'src/app/models/aviso.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @Input() avisos: Avisos;
  constructor() { }

  ngOnInit() {
  }

}
