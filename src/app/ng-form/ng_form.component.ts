import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-c03-persona-listar',
  // Ojo no se puede utilizar gion medio "-"
  //templateUrl: './ng-form.component.html',
  templateUrl: './ng_form.component.html',
  //styleUrls: ['./ng_form.component.css']
})
export class C03PersonaListarComponent {

 //Creamos un Arreglo de Personas, con 4 personas posición de 0 a 3
 public lPersonas:String[] =["Sergio","Roxana","Liliana","Abby"]

}
