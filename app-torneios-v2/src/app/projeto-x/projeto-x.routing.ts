import { Routes } from "@angular/router";
import { TenantComponent } from "./tenant/tenant.component";
import { UsuariosTenantComponent } from "./usuarios-tenant/usuarios-tenant.component";
import { ConfigsAcessosComponent } from "./configs-acessos/configs-acessos.component";


export const ProjetoXRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'tenant',
        title: 'Tenant - Scout',
        component: TenantComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'usuarios-tenant',
        title: 'Usuários Tenant - Scout',
        component: UsuariosTenantComponent
    }]},
    {
      path: '',
      children: [ {
        path: 'configuracoes-acessos',
        title: 'Configuraçoes de Acessos- Scout',
        component: ConfigsAcessosComponent
    }]},
];