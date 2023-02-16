import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ProjetoXRoutes } from './projeto-x.routing';
import { TenantComponent } from './tenant/tenant.component';


@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(ProjetoXRoutes),
      FormsModule,
      MaterialModule
    ],
    declarations: [
        TenantComponent
    ]
  })
  
  export class ProjetoXModule {}
  