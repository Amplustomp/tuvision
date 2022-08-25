import { Component, OnInit } from '@angular/core';
import { IMoto } from '../componentes/moto.interface';
import { ListarService } from '../services/listar.service';

@Component({
  selector: 'app-por-moto',
  templateUrl: './por-moto.component.html',
  styleUrls: ['./por-moto.component.css']
})
export class PorMotoComponent implements OnInit {

  constructor(private servicio:ListarService) { }

  ngOnInit(): void {
    this.buscarEmit("motos")
  }

  // Variable que se utilizará para desplegar la palabra seleccionada
  txBuscar:string="sp"
  // Check para indicar si hay error
  swError:boolean=false
  // Si es true se activa el bloque de ayuda en el html
  mostrarSugerencias: boolean = false;
  // Arreglo de paises sugeridos
  motosSugeridos   : any[] = [];
  //  Resultados de Paises
  motos:IMoto[]=[]
  // Método que se ejecutará cuando
  // presionen enter en el componente input
  buscarEmit(stBuscar:any){
    console.log("Método Buscar, Por Bancos")
    // Guardamos lo recibido en nuestra variable local
    this.txBuscar = stBuscar
    // Marcamos que no hay error
    this.swError=false
    this.servicio.buscarMoto(this.txBuscar)
    .subscribe({
      next: (motos) => {  // nextHandler
         console.log("next",motos)
         this.swError=false
          // Guardmos la respuesta en el arreglo paises
          // El cual se desplegará en pantalla
          this.motos=motos
        },
      complete: () => { console.log("complete") }, // completeHandler
      error: (error) => { console.log("Error")
                    console.info(error)
                    this.swError=true
                    // Limpiamos el arreglo
                    this.motos=[]
     },    // errorHandler
     });
  }
  // Método que se ejecutará cuando se
  // produsca  onDebounce en el componente input
  sugerencia(stBuscar:any){
	console.log("Método Sugerencia Motos")
  }
  // Método que se ejecutará cuando den click
  // en una de la lista sugerida
  buscarSugerido(stBuscar:any){
  	console.log("Método Buscar Sugerido Motos")
  }

}
