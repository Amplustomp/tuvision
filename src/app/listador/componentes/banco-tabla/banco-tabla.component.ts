import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListarService } from '../../services/listar.service';
import { IBanco } from '../banco.interface';

@Component({
  selector: 'app-banco-tabla',
  templateUrl: './banco-tabla.component.html',
  styleUrls: ['./banco-tabla.component.css']
})
export class BancoTablaComponent implements OnInit {

  @Input() bancos_entrada:IBanco[]=[]

  constructor(private router:Router) { }

  ngOnInit(): void {

  }

   irSucursales(){
    this.router.navigate(['listar-sucursales'])

  }


}
