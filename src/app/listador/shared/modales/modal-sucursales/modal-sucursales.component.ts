import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Sucursales } from 'src/app/listador/componentes/banco.interface';

@Component({
  selector: 'app-modal-sucursales',
  templateUrl: './modal-sucursales.component.html',
  styleUrls: ['./modal-sucursales.component.scss']
})
export class ModalSucursalesComponent implements OnInit {

  @Input() listadoSucursales: Sucursales[] = [];

  constructor(private bsModalService: BsModalService) { }

  ngOnInit(): void {
  }


  closeModal = () => this.bsModalService.hide();

}
