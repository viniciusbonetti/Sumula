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
        title: 'Cargos - Scout',
        component: CargosComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'modalidades',
        title: 'Modalidades - Scout',
        component: ModalidadesComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'eventos',
        title: 'Eventos - Scout',
        component: EventosComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'localidades',
        title: 'Localidades - Scout',
        component: LocalidadeComponent
    }]},
];