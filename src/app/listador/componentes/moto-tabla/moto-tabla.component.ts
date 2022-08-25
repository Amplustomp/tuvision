import { Component, Input, OnInit } from '@angular/core';
import { IMoto } from '../moto.interface';

@Component({
  selector: 'app-moto-tabla',
  templateUrl: './moto-tabla.component.html',
  styleUrls: ['./moto-tabla.component.css']
})
export class MotoTablaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

    // campo de entrada del Arreglo Paises
    @Input() motos_entrada:IMoto[]=[]

}
