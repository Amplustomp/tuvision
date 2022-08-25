import { Component, OnInit } from '@angular/core';
import { IBanco } from '../componentes/banco.interface';
import { ListarService } from '../services/listar.service';

@Component({
  selector: 'app-por-bancos',
  templateUrl: './por-bancos.component.html',
  styleUrls: ['./por-bancos.component.css']
})
export class PorBancosComponent implements OnInit {

  constructor(private servicio:ListarService) { }

  ngOnInit(): void {
    return this.buscarEmit('bancos')
  }

// Variable que se utilizará para desplegar la palabra seleccionada
txBuscar:string="sp"
// Check para indicar si hay error
swError:boolean=false
// Si es true se activa el bloque de ayuda en el html
mostrarSugerencias: boolean = false;
// Arreglo de paises sugeridos
bancosSugeridos   : any[] = [];
//  Resultados de Paises
bancos:IBanco[]=[]
// Método que se ejecutará cuando
// presionen enter en el componente input
buscarEmit(stBuscar:any){
  console.log("Método Buscar, Por Bancos")
  // Guardamos lo recibido en nuestra variable local
  this.txBuscar = stBuscar
  // Marcamos que no hay error
  this.swError=false
  this.servicio.buscarBanco(this.txBuscar)
  .subscribe({
    next: (bancos) => {  // nextHandler
       console.log("next",bancos)
       this.swError=false
        // Guardmos la respuesta en el arreglo paises
        // El cual se desplegará en pantalla
        this.bancos=bancos
        bancos.map(banco=>{
          console.log("Banco",banco)
          this.servicio.sucursales = banco.sucursales
        })
      },
    complete: () => { console.log("complete") }, // completeHandler
    error: (error) => { console.log("Error")
                  console.info(error)
                  this.swError=true
                  // Limpiamos el arreglo
                  this.bancos=[]
   },    // errorHandler
   });

}
// Método que se ejecutará cuando se
// produsca  onDebounce en el componente input
sugerencia(stBuscar:any){
console.log("Método Sugerencia, Por Banco")
}
// Método que se ejecutará cuando den click
// en una de la lista sugerida
buscarSugerido(stBuscar:any){
  console.log("Método Buscar Sugerido, Por Banco")
}

}
