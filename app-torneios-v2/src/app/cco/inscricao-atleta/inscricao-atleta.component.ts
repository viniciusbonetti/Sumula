import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ControllerComponent } from "src/app/controller/controller.component";
import { Observable } from "rxjs";
import { filter, map, startWith } from "rxjs/operators";

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
    public listaEquipesInscricao: Array<{}> = [];

    // select
    public selectEvento: string = "";
    public selectModalidadeEvento: string = "";
    public selectDelegacaoEvento: string = "";

    // formcontrol
    myControl = new FormControl("");
    options: Atleta[] = [];
    filteredOptions: Observable<Atleta[]>;

    // misc
    public idAtleta:string = "";

    ngOnInit(): void {
        this.getEventos();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map((value) => this._filter(value || ""))
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
        const formTeste = new FormData();
        formTeste.append('tipo_request', 'listaDelegacaoAtleta')
        formTeste.append('id_modalidadeevento', modalidadeEvento)
        let resposta = await this.postInfo(this.paths.geral, formTeste,this.setToken);

        resposta = this.sortTable('nm_delegacao', resposta, 'ASC', '', true);
        resposta.forEach(resp => {
            resp.atleta = this.sortTable('nm_atleta', resp.atleta, 'ASC', '', true);
        });

        console.log(resposta);

        this.listaDelegacaoEvento = resposta;
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
    }

    private _filter(value: string): Atleta[] {
        value = value.toString();
        const filterValue = value.toLowerCase();

        return this.options.filter((option) => option.nm_atleta.toLowerCase().includes(filterValue));
    }

    public selected(event) {
        this.idAtleta = event.option.value.id_atleta;
    }

    displayNome(option) {
        if(option != ''){
            return option.nm_atleta;
        } else {
            return '';
        }
    }

    public async getEquipeInscricao(delegacao) {
        this.listaEquipesInscricao = [];
        if (delegacao != "") {
            const path = this.paths.equipeinscricao + `/t${delegacao}`;
            let resposta = await this.getInfo(path, this.setToken);
            if (resposta.status == 200) {
                this.listaEquipesInscricao = resposta.data.data;
            }
        }
    }

    public async sendEquipeInscricao(delegacao){
        const formEquipeInscricao = new FormData();
        formEquipeInscricao.append('id_atleta', this.idAtleta);
        formEquipeInscricao.append('id_inscricao', delegacao);
        await this.postInfo(this.paths.equipeinscricao, formEquipeInscricao, this.setToken);
        this.getEquipeInscricao(delegacao);

        this.idAtleta = '';
        this.myControl.setValue('');
    }

    public cancelar(){
        this.myControl.setValue('');
    }

    public async excluir(item, delegacao){
        const path = this.paths.equipeinscricao + `/${item.id}`
        await this.deleteInfo(path, this.setToken);
        this.getEquipeInscricao(delegacao);
    }
}
