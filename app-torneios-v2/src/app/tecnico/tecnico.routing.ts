import { Routes } from "@angular/router";
import { DelegacaoComponent } from "./delegacao/delegacao.component";
import { AtletaComponent } from "./atleta/atleta.component";


export const TecnicoRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'delegacao',
        title: 'Delegação - Sumula',
        component: DelegacaoComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'atleta',
        title: 'Atleta - Sumula',
        component: AtletaComponent
    }]},
];