import { Component, OnInit } from '@angular/core';
import { Moto, Motos } from '../componentes/moto.interface';
import { BancosService } from '../services/diccionario.service';

@Component({
  selector: 'app-por-moto',
  templateUrl: './por-moto.component.html',
  styleUrls: ['./por-moto.component.css']
})
export class PorMotoComponent implements OnInit {

  listadoMotos!: any;
  swError:boolean=false

  constructor(private bancosService: BancosService) { }

  ngOnInit(): void {
    this.inicializaValores()
  }

inicializaValores() {
  this.getBancos();
}

getBancos() {

  this.bancosService.dataGetMotos().subscribe((moto: Motos) => {
    this.listadoMotos = moto.motos;
    console.log("Bancosososo",this.listadoMotos)
  })
}

}
