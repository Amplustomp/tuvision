import {Component} from '@angular/core';

@Component({
     selector:'app-contador'  // Nombre del modulo
     // Oberve que es template, NO template Url
     // utiliza el html sin archivo
    ,template:`
                <hr>
                <h1><font color="red"><p>Componente 02 Contador!</p></font></h1>
                <h1>Variable Title <font color="red">{{title}}</font></h1>
                <h1>Titulo de la canción <font color="red">{{title_harrys}}</font></h1>

                <h1>Expresión Matemática dentro de llaves  <font color="red">{{5 * 3}}</font></h1>

                <!-- Evento sin utilizar el TS -->
                <h1>Evento Sin Método <button (click) = "contador=contador + 1" >Evento Sumar sin TS +1</button></h1>

                <!-- Desplegando Variable -->
                <h1>Desplegando contador  <font color="red">{{contador}}</font></h1>

                <!-- Evento sin utilizar el TS -->
                <button (click) = "contador=contador - 1">Evento Restar sin TS -1</button>

                <!-- Invoca al método Sumar con Nros -->
                <h1>Invocar Método sumar  con Nros <font color="red">{{sumar(2,3)}}</font></h1>
                <!-- Invoca al método Sumar_v2 con String -->
                <h1>Invocar Método sumar v2 Con String <font color="red">{{sumar_v2(2,'3')}}</font></h1>

                <!-- Evento sin Método y despliega variable Base -->
                <h1>Evento suma  base sin Método  <button (click) = "contador=contador + base" >+{{base}}</button></h1>
                <h1>Evento resta base sin Método  <button (click) = "contador=contador - base">-{{base}}</button></h1>
                <h1>Base <font color="red">{{base}}</font></h1>

             `
})
// Export lo podemos utilizar afuera
// Nombre del Clase
export class ContadorComponent{
    // Creamos Variable Inciando valores
    title = 'proyecto';
    public title_harrys:string = 'proyecto Harrys Titulo';
    public contador:number=100;
    public base:number=10;

    // Método sumar,
    // suma los dos números más la base
    sumar(n1:number,n2:number){
      return n1+n2 + this.contador
    }

    // Método sumar_v2,
    // Realiza un casting ya que uno de los nros. es String
    sumar_v2(n1:number,n2:string){
      return n1 + n2 + this.contador
    }

}
