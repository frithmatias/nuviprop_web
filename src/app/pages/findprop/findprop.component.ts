import { Component, OnInit } from '@angular/core';
declare function init_plugins();
@Component({
  selector: 'app-findprop',
  templateUrl: './findprop.component.html',
  styleUrls: ['./findprop.component.css']
})
export class FindpropComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    init_plugins();
  }

}
