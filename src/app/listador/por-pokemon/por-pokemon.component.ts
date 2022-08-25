import { Component, OnInit } from '@angular/core';
import { IPokemon } from '../componentes/pokemon.interface';
import { ListarService } from '../services/listar.service';

@Component({
  selector: 'app-por-pokemon',
  templateUrl: './por-pokemon.component.html',
  styleUrls: ['./por-pokemon.component.css']
})
export class PorPokemonComponent implements OnInit {

  constructor(private servicio:ListarService) { }

  ngOnInit(): void {
  }

  // Variable que se utilizará para desplegar la palabra seleccionada
  txBuscar:string="sp"
  // Check para indicar si hay error
  swError:boolean=false
  // Si es true se activa el bloque de ayuda en el html
  mostrarSugerencias: boolean = false;
  // Arreglo de paises sugeridos
  pokemonSugeridos   : any[] = [];
  //  Resultados de Paises
  pokemon:IPokemon[]=[]
  // Método que se ejecutará cuando
  // presionen enter en el componente input
  buscarEmit(stBuscar:any){
    console.log("Método Buscar, Por Bancos")
    // Guardamos lo recibido en nuestra variable local
    this.txBuscar = stBuscar
    // Marcamos que no hay error
    this.swError=false
    this.servicio.buscarPokemon(this.txBuscar)
    .subscribe({
      next: (pokemon) => {  // nextHandler
         console.log("next",pokemon)
         this.swError=false
          // Guardmos la respuesta en el arreglo paises
          // El cual se desplegará en pantalla
          this.pokemon=pokemon
        },
      complete: () => { console.log("complete") }, // completeHandler
      error: (error) => { console.log("Error")
                    console.info(error)
                    this.swError=true
                    // Limpiamos el arreglo
                    this.pokemon=[]
     },    // errorHandler
     });
  }
  // Método que se ejecutará cuando se
  // produsca  onDebounce en el componente input
  sugerencia(stBuscar:any){
	console.log("Método Sugerencia Pokemon")
  }
  // Método que se ejecutará cuando den click
  // en una de la lista sugerida
  buscarSugerido(stBuscar:any){
  	console.log("Método Buscar Sugerido Pokemon")
  }

}
