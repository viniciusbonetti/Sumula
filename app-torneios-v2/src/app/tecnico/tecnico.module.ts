import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";

import { TecnicoRoutes } from "./tecnico.routing";
import { NgxPaginationModule } from "ngx-pagination";
import { AtletaComponent, AtletaModal } from "./atleta/atleta.component";
import { DelegacaoComponent } from "./delegacao/delegacao.component";

@NgModule({
    imports: [CommonModule, RouterModule.forChild(TecnicoRoutes), FormsModule, MaterialModule, NgxPaginationModule],
    declarations: [AtletaComponent, DelegacaoComponent, AtletaModal],
})
export class TecnicoModule {}
