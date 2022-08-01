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

    // Getter an Setter
    // No Amite ningún parámetro
    get getCompleto():String{
      return `${this.nombres} - ${this.apPaterno} - ${this.apMaterno}`
  }

  // Solo admite un parámetro
  set setNombres(val:String){
      this.nombres= val
  }

  // Método utilizado en el HTML
  ponerFemeninita():void{
    this.nombres=" Serguiña Elune";
  }

  // Método utilizado en el HTML
  ponerMasculinito():void{
    //this.nombres=" Carlos Mario";
    // Podemos utilizar el Setter, se utiliza con asignación
    this.setNombres = " Serguito Tempestira"
}

}


