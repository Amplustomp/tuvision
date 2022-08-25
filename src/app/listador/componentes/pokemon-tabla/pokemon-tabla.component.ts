import { Component, Input, OnInit } from '@angular/core';
import { IPokemon } from '../pokemon.interface';

@Component({
  selector: 'app-pokemon-tabla',
  templateUrl: './pokemon-tabla.component.html',
  styleUrls: ['./pokemon-tabla.component.css']
})
export class PokemonTablaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() pokemon_entrada:IPokemon[]=[]

}
