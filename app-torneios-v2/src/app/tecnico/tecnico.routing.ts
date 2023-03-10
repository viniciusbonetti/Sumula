import { Routes } from "@angular/router";
import { DelegacaoComponent } from "./delegacao/delegacao.component";
import { AtletaComponent } from "./atleta/atleta.component";


export const TecnicoRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'delegacao',
        title: 'Delegação - Scout',
        component: DelegacaoComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'atleta',
        title: 'Atleta - Scout',
        component: AtletaComponent
    }]},
];