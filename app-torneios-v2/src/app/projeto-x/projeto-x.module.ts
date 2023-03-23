import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ProjetoXRoutes } from './projeto-x.routing';
import { TenantComponent } from './tenant/tenant.component';
import { UsuariosTenantComponent } from './usuarios-tenant/usuarios-tenant.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfigsAcessosComponent } from './configs-acessos/configs-acessos.component';

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(ProjetoXRoutes),
      FormsModule,
      MaterialModule,
      NgxPaginationModule,
    ],
    declarations: [
        TenantComponent,
        UsuariosTenantComponent,
        ConfigsAcessosComponent,
    ]
  })
  
  export class ProjetoXModule {}
  