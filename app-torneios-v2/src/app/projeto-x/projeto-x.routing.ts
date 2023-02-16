import { Routes } from "@angular/router";
import { TenantComponent } from "./tenant/tenant.component";
import { UsuariosTenantComponent } from "./usuarios-tenant/usuarios-tenant.component";


export const ProjetoXRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'tenant',
        component: TenantComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'usuarios-tenant',
        component: UsuariosTenantComponent
    }]},
];