import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PersonaDatosComponent } from './persona/persona.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContadorComponent } from './contador/contador.component';
import { C03PersonaListarComponent } from './ng-form/ng_form.component';


@NgModule({
  declarations: [
    AppComponent,
    PersonaDatosComponent,
    ContadorComponent,
    C03PersonaListarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
