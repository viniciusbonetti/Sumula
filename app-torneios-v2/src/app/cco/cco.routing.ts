import { Routes } from "@angular/router";
import { CargosComponent } from "./cargos/cargos.component";
import { ModalidadesComponent } from "./modalidades/modalidades.component";
import { EventosComponent } from "./eventos/eventos.component";
import { LocalidadeComponent } from "./localidade/localidade.component";


export const CcoRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'cargos',
        title: 'Cargos - Sumula',
        component: CargosComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'modalidades',
        title: 'Modalidades - Sumula',
        component: ModalidadesComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'eventos',
        title: 'Eventos - Sumula',
        component: EventosComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'localidades',
        title: 'Localidades - Sumula',
        component: LocalidadeComponent
    }]},
];