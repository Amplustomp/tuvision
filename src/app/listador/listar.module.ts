import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageListarComponent } from './page-listar/page-listar.component';
import { RouterModule } from '@angular/router';
import { SidebarListarComponent } from './shared/sidebar-listar/sidebar-listar.component';
import { PorBancosComponent } from './por-bancos/por-bancos.component';
import { PorMotoComponent } from './por-moto/por-moto.component';
import { PorPokemonComponent } from './por-pokemon/por-pokemon.component';
import { PokemonInputComponent } from './componentes/pokemon-input/pokemon-input.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalSucursalesModule } from './shared/modales/modal-sucursales/modal-sucursales.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MaterialModule } from './shared/material/MaterialModule';


@NgModule({
  declarations: [
    PageListarComponent,
    SidebarListarComponent,
    PorBancosComponent,
    PorMotoComponent,
    PorPokemonComponent,
    PokemonInputComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    ModalSucursalesModule,
    MaterialModule
  ],
  exports: [
    PageListarComponent
  ],
  providers: [BsModalService]
})
export class ListarModule { }
