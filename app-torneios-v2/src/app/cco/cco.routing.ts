import { Routes } from "@angular/router";
import { CargosComponent } from "./cargos/cargos.component";
import { ModalidadesComponent } from "./modalidades/modalidades.component";
import { EventosComponent } from "./eventos/eventos.component";


export const CcoRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'cargos',
        component: CargosComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'modalidades',
        component: ModalidadesComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'eventos',
        component: EventosComponent
    }]},
];