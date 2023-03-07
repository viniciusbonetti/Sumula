import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";

import { CcoRoutes } from "./cco.routing";
import { NgxPaginationModule } from "ngx-pagination";
import { CargosComponent } from "./cargos/cargos.component";
import { ModalidadesComponent } from "./modalidades/modalidades.component";
import { EventosComponent, EventosModal } from "./eventos/eventos.component";
import { LocalidadeComponent } from './localidade/localidade.component';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(CcoRoutes), FormsModule, MaterialModule, NgxPaginationModule],
    declarations: [CargosComponent, ModalidadesComponent, EventosComponent, EventosModal, LocalidadeComponent],
})
export class CcoModule {}
