import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalesComponent } from './listador/componentes/banco-tabla/sucursales/sucursales.component';
import { PorBancosComponent } from './listador/por-bancos/por-bancos.component';
import { PorMotoComponent } from './listador/por-moto/por-moto.component';
import { PorPokemonComponent } from './listador/por-pokemon/por-pokemon.component';


const misRoutesHijas:Routes=[
          { path:'',
            children:[
              {path:'listar-moto'     , component:PorMotoComponent},
              {path:'listar-bancos'   , component:PorBancosComponent},
              {path:'listar-pokemon'  , component:PorPokemonComponent},
                {path:'listar-sucursales'            , component:SucursalesComponent}
                            ]
          }
];

@NgModule({
  imports:[RouterModule.forRoot(misRoutesHijas)],
  exports:[RouterModule],

})
export class AppRoutingListarModule { }
