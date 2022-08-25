import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListarService } from 'src/app/listador/services/listar.service';
import { Surcursal } from '../../banco.interface';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit {

  sucursales_entrada:Surcursal[]=[]

  constructor(private service:ListarService,private router:Router) { }

  ngOnInit(): void {
    console.log("Sucursales",this.service.sucursales)
    this.sucursales_entrada=this.service.sucursales
  }

  Volver(){
    this.router.navigate(['listar-bancos'])

  }

}
