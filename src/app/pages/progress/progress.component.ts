import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  // valores iniciales
  progreso1 = 30;
  progreso2 = 65;

  constructor() { }

  ngOnInit() {
  }



}
