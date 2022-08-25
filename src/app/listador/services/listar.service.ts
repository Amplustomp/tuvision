import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBanco, Surcursal } from '../componentes/banco.interface';
import { IMoto } from '../componentes/moto.interface';
import { IPokemon } from '../componentes/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class ListarService {

  sucursales:any

  constructor(private http:HttpClient) { }

    // Variable para la url
    private apiUrl :string='http://api.countrylayer.com/v2/'
    // Variable para la Api Key
    private apiKey:string="kiekejeoio8383733ujeij3u3u3"
    // Retorna los parámetros que enviaremos al sitio real
    // Esto solo funciona cuando funciona contra el sitio real
    get httpParamsMoto () {
      return new HttpParams().set( 'fields'
                    , 'patente;color;nro_Chasis;max_speed'
                //, 'name;capital'
                    ).set("access_key",this.apiKey);
    }

    get httpParamsBanco () {
      return new HttpParams().set( 'fields'
                    , 'nombre;direccion;telefono;sucursales'
                //, 'name;capital'
                    ).set("access_key",this.apiKey);
    }

    get httpParamsPokemon () {
      return new HttpParams().set( 'fields'
                    , 'id;name;type;base'
                //, 'name;capital'
                    ).set("access_key",this.apiKey);
    }



   // Método que consulta al back-end por los paises
    buscarMoto(stBusco:string):Observable<IMoto[]>{
      // Crea la URl
      let stUrl = `${this.apiUrl}motos/${stBusco}`
      // Modificamos la url solo para realizar pruebas locales
      stUrl=`http://localhost:3000/${stBusco}`
        // Visitamos la url, y eviamos los parámetros
        return this.http.get<IMoto[]>(stUrl, { params: this.httpParamsMoto })
    }

     // Método que consulta al back-end por los paises
     buscarBanco(stBusco:string):Observable<IBanco[]>{
      // Crea la URl
      let stUrl = `${this.apiUrl}bancos/${stBusco}`
      // Modificamos la url solo para realizar pruebas locales
      stUrl=`http://localhost:3000/${stBusco}`
        // Visitamos la url, y eviamos los parámetros
        return this.http.get<IBanco[]>(stUrl, { params: this.httpParamsBanco })
    }

       // Método que consulta al back-end por los paises
       buscarPokemon(stBusco:string):Observable<IPokemon[]>{
        // Crea la URl
        // Modificamos la url solo para realizar pruebas locales
        let stUrl=`http://localhost:3000/pokemon/?id=${stBusco}`
          // Visitamos la url, y eviamos los parámetros
          return this.http.get<IPokemon[]>(stUrl, { params: this.httpParamsPokemon })
      }


}
