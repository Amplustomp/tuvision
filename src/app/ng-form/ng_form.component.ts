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
 public lPersonasEliminados:String[]=[]

   // Método que elimina el primer registro del arreglo
   borrarPrimerPersona(){
    // shift devuelve string o undefined, por eso colocamos || ''
    // si es undefined coloque ==> ''
    const borrado = this.lPersonas.shift() || ''
    // push agrega al final del registro
    this.lPersonasEliminados.push(borrado);
   }

   public booleanA: boolean = true;
   public booleanB: boolean = true;

   lPersonasPais: any[] = [
    {
      "name": "Sergio",
      "age": 35,
      "country": 'MARS'
    },
    {
      "name": "Roxana",
      "age": 32,
      "country": 'USA'
    },
    {
      "name": "Liliana",
      "age": 21,
      "country": 'HK'
    },
    {
      "name": "Abby",
      "age": 34,
      "country": 'UK'
    },
    {
      "name": "Locky",
      "age": 32,
      "country": 'USA'
    }
  ];

  selectedValue: string= 'Two';  //ngSwitch

}

