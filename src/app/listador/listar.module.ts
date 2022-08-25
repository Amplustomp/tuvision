import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotoTablaComponent } from './componentes/moto-tabla/moto-tabla.component';
import { BancoInputComponent } from './componentes/banco-input/banco-input.component';
import { PageListarComponent } from './page-listar/page-listar.component';
import { RouterModule } from '@angular/router';
import { SidebarListarComponent } from './shared/sidebar-listar/sidebar-listar.component';
import { PorBancosComponent } from './por-bancos/por-bancos.component';
import { PorMotoComponent } from './por-moto/por-moto.component';
import { PorPokemonComponent } from './por-pokemon/por-pokemon.component';
import { PokemonTablaComponent } from './componentes/pokemon-tabla/pokemon-tabla.component';
import { BancoTablaComponent } from './componentes/banco-tabla/banco-tabla.component';
import { MotoInputComponent } from './componentes/moto-input/moto-input.component';
import { PokemonInputComponent } from './componentes/pokemon-input/pokemon-input.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SucursalesComponent } from './componentes/banco-tabla/sucursales/sucursales.component';



@NgModule({
  declarations: [
    MotoTablaComponent,
    BancoInputComponent,
    PageListarComponent,
    SidebarListarComponent,
    PorBancosComponent,
    PorMotoComponent,
    PorPokemonComponent,
    PokemonTablaComponent,
    BancoTablaComponent,
    MotoInputComponent,
    PokemonInputComponent,
    SucursalesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    PageListarComponent
  ]
})
export class ListarModule { }
