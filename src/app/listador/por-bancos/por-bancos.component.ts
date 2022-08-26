import { Component, OnInit, TemplateRef } from '@angular/core';
import { Bancos, Sucursales } from '../componentes/banco.interface';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BancosService } from '../services/diccionario.service';

@Component({
  selector: 'app-por-bancos',
  templateUrl: './por-bancos.component.html',
  styleUrls: ['./por-bancos.component.css']
})
export class PorBancosComponent implements OnInit {

listadoBancos!: any;
listadoSucursales: Sucursales[] = [];

  /* Modales */
  configBackdrop = {
    animated: true,
    keyboard: true,
    backdrop: true,
    class: 'modal-lg',
    ignoreBackdropClick: true,
  };

  constructor(private bancosService: BancosService, private bsModalService: BsModalService) { }

  ngOnInit(): void {
    this.inicializaValores()
  }

inicializaValores() {
  this.getBancos();
}

getBancos() {

  this.bancosService.dataGetBancos().subscribe((banco: Bancos) => {
    this.listadoBancos = banco.bancos;
    console.log("Bancosososo",this.listadoBancos)
  })
}

openModalVerSucursales(verSucursales: TemplateRef<any>, sucursales: Sucursales[]) {
  this.bsModalService.show(verSucursales, this.configBackdrop);
  this.listadoSucursales = sucursales;
}

}
