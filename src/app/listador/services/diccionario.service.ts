import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bancos } from '../componentes/banco.interface';
import { Observable } from 'rxjs';
import { Motos } from '../componentes/moto.interface';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  constructor(private http: HttpClient) { }


  dataGetBancos():Observable<Bancos>{
    const apiUrl = `assets/data/db.json`
    return this.http.get<Bancos>(apiUrl);
  }

  dataGetMotos():Observable<Motos>{
    const apiUrl = `assets/data/db.json`
    return this.http.get<Motos>(apiUrl);
  }

}
