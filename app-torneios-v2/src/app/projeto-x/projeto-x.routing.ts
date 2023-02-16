import { Routes } from "@angular/router";
import { TenantComponent } from "./tenant/tenant.component";


export const ProjetoXRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'tenant',
        component: TenantComponent
    }]},
];