import { Component, Input, Output, ViewChild, OnInit, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  // Inputs que vienen del HTML padre, solo son el nombre de las leyendas y los valores
  // por defecto en los inputs de los incrementadores.
  @Input() nombre = 'Leyenda';
  @Input() progreso = 50;

  // Output hacia el HTML padre
  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  // ViewChild para obtener el elemento y hacer foco en el input
  @ViewChild('inputIncrementador', { static: false }) txtProgress: ElementRef;

  constructor() {
    // console.log('Leyenda', this.leyenda);
    // console.log('progreso', this.progreso);
  }

  ngOnInit() {
    // console.log('Leyenda', this.leyenda);
    // console.log('progreso', this.progreso);
  }



  // cuando yo no hago click ni en - ni + en el incrementador, sino que cambio el valor
  // del progress en el input con las flechas del teclado, escucho al evento (ngModelChange)
  // para llamar al metodo onChanges()
  onChanges( newValue: number ) {

    // let elemHTML: any = document.getElementsByName('progreso')[0];
    // console.log( this.txtProgress );

    if ( newValue >= 100 ) {
      this.progreso = 100;
    } else if ( newValue <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    // elemHTML.value = this.progreso;
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit( this.progreso );

  }

  cambiarValor( valor: number ) {
    // valor puede ser 5 o -5
    if ( this.progreso >= 100 && valor > 0 ) {
      this.progreso = 100;
      return;
    }

    if ( this.progreso <= 0 && valor < 0 ) {
      this.progreso = 0;
      return;
    }

    this.progreso = this.progreso + valor;
    this.cambioValor.emit( this.progreso ); // Le envío al padre el nuevo valor para dibujar las barras de progreso
    this.txtProgress.nativeElement.focus();

  }

}
