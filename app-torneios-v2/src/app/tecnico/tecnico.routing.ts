import { Routes } from "@angular/router";
import { DelegacaoComponent } from "./delegacao/delegacao.component";
import { AtletaComponent } from "./atleta/atleta.component";


export const TecnicoRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'delegacao',
        component: DelegacaoComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'atleta',
        component: AtletaComponent
    }]},
];