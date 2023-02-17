import { Routes } from "@angular/router";


export const TecnicoRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'delegacao',
        // component: CargosComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'atleta',
        // component: ModalidadesComponent
    }]},
];