import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";

import { CcoRoutes } from "./cco.routing";
import { NgxPaginationModule } from "ngx-pagination";
import { CargosComponent } from "./cargos/cargos.component";
import { ModalidadesComponent } from "./modalidades/modalidades.component";
import { EventosComponent, EventosModal, InscricaoDelegacaoModal } from "./eventos/eventos.component";
import { LocalidadeComponent } from './localidade/localidade.component';
import { InscricaoAtletaComponent } from './inscricao-atleta/inscricao-atleta.component';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(CcoRoutes), FormsModule, MaterialModule, NgxPaginationModule, ReactiveFormsModule],
    declarations: [CargosComponent, ModalidadesComponent, EventosComponent, EventosModal, LocalidadeComponent, InscricaoDelegacaoModal, InscricaoAtletaComponent],
})
export class CcoModule {}
