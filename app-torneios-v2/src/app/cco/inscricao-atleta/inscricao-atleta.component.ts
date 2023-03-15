import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ControllerComponent } from "src/app/controller/controller.component";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface Atleta {
    id_atleta: string;
    nm_atleta: string;
    nm_apelido: string;
    tp_genero: string;
    nr_idade: string;
}

@Component({
    selector: "app-inscricao-atleta",
    templateUrl: "./inscricao-atleta.component.html",
    styleUrls: ["./inscricao-atleta.component.css"],
})
export class InscricaoAtletaComponent extends ControllerComponent implements OnInit {
    // headers
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    // listas
    public listaEventos: Array<{}> = [];
    public listaModalidadesEvento: Array<{}> = [];
    public listaDelegacaoEvento: Array<{}> = [];
    public listaAtletas: Array<{}> = [];

    // select
    public selectEvento: string = "";
    public selectModalidadeEvento: string = "";
    public selectDelegacaoEvento: string = "";

    // formcontrol
    myControl = new FormControl("");
    options: Atleta[] = [];
    filteredOptions: Observable<Atleta[]>;

    // misc
    public nomeAtleta = "";

    ngOnInit(): void {
        this.getEventos();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map((value) => this._filter(value || "")),
        );        
    }

    public async getEventos() {
        const path = this.paths.evento + `/t${this.tenant}`;
        let resposta = await this.getInfo(path, this.setToken);
        this.listaEventos = resposta.data.data;
    }

    public async getModalidadesEvento(idEvento) {
        this.listaModalidadesEvento = [];
        this.selectModalidadeEvento = "";
        this.selectDelegacaoEvento = "";
        const path = this.paths.modalidadeevento + `/i${idEvento}&t${this.tenant}`;
        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaModalidadesEvento = resposta.data.data;
        }
    }

    public async getDelegacaoEvento(modalidadeEvento) {
        const path = this.paths.inscricaodelegacao + `/m${modalidadeEvento}&t${this.tenant}`;

        let resposta = await this.getInfo(path, this.setToken);
        this.listaDelegacaoEvento = resposta.data.data;
        this.getAtletas();
    }

    public async getAtletas() {
        const path = this.paths.geral;
        const formGetAtletasModalidade = new FormData();
        formGetAtletasModalidade.append("tipo_request", "listaAtletaModalidade");
        formGetAtletasModalidade.append("id_modalidade", this.selectModalidadeEvento);
        formGetAtletasModalidade.append("id_evento", this.selectEvento);
        let resposta = await this.postInfo(path, formGetAtletasModalidade, this.setToken);
        if (resposta.length > 0) {
            this.options = resposta;
        }
        // this.listaAtletas.forEach((element) => {
        //     this.options.push(element);
        // });
        // console.log(this.options);
    }

    private _filter(value: string): Atleta[] {
        const filterValue = value.toLowerCase();

        return this.options.filter((option) => option.nm_atleta.toLowerCase().includes(filterValue));
    }

    public button(event) {
        console.log(event);
        // this.options.forEach(element => {
        //     if(event.option.value.id_atleta == element.id_atleta){
        //         this.nomeAtleta = element.nm_atleta
        //     }
        // });
    }

    displayNome(atleta: Atleta): string {
        console.log(atleta);

        return atleta && atleta.nm_atleta ? atleta.nm_atleta : "";
    }
}
