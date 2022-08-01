import { Component } from "@angular/core";

@Component({
    selector:'app-persona',
    templateUrl:'./persona.component.html'
})

export class PersonaDatosComponent {

  run :number=17117665-4;
  nombres:String="Sergio Daniel";
  apPaterno:String="Cortés"
  apMaterno:String="Pérez"
  title = 'Informático del Ático';

  obtenerNombre():String{
    var palabra:String =   `${this.nombres} - ${this.apPaterno} - ${this.apMaterno}`
    return palabra.toUpperCase()
}
}


