import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-por-pokemon',
  templateUrl: './por-pokemon.component.html',
  styleUrls: ['./por-pokemon.component.css']
})
export class PorPokemonComponent implements OnInit {

  pokemon: any = '';
  pokemonImg = '';
  pokemonImgReverse = '';
  pokemonType = [];

  constructor(private activatedRouter: ActivatedRoute, private pokemonService:PokemonService) {

   }

  // Variable que se utilizará para desplegar la palabra seleccionada
  txBuscar:string="sp"
  // Check para indicar si hay error
  swError:boolean=false
  // Si es true se activa el bloque de ayuda en el html

  ngOnInit(): void {

  }

  getPokemon(id: any) {
    this.pokemonService.getPokemons(id).subscribe({
      next: res => {
        this.pokemon = res
        this.pokemonImg = this.pokemon.sprites.front_default
        this.pokemonImgReverse = this.pokemon.sprites.back_default
        this.pokemonType =  res.types.map((tipo: any) => {
          return tipo.type.name
       })
      },
      error: err => console.log(err),
      complete: () => console.log('Pokemon obtenido: ', this.pokemon)
    }
    )
  }



}
