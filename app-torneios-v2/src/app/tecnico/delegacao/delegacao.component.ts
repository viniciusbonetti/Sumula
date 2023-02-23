import { Component, OnInit } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";

@Component({
    selector: "app-delegacao",
    templateUrl: "./delegacao.component.html",
    styleUrls: ["./delegacao.component.css"],
})
export class DelegacaoComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public url = `${this.baseUrl}/delegacao`;

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    public listaDelegacoes: Array<{ id: string; nm_delegacao: string }> = [];
    public listaDelegacoesFiltrada: Array<{}> = [];
    public listaMunicipios: Array<{}> = [];
    public listaEstado = JSON.parse(localStorage.getItem("listaEstados"));

    public inputNomeDelegacao: string = "";
    public inputEditarDelegacao: string = "";

    public idDelegacao = "";

    public estadoSelect = "";
    public municipioSelect = "";
    public editarEstadoSelect = "";
    public editarMunicipioSelect = "";

    public novoCadastro = false;
    public mostrarEditarDelegacao = false;

    ngOnInit(): void {
        this.getDelegacao();
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["nm_cargo"];

        this.listaDelegacoesFiltrada = this.filterTable(columns, this.listaDelegacoes, conteudo);
        this.pagAtual = 1;
    }

    public async getMunicipio(select) {
        let path = this.paths.municipio + `/${select}`;
        this.listaMunicipios = await this.getInfo(path, this.setToken);
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async getDelegacao() {
        this.listaDelegacoes = await this.getInfo(this.paths.delegacao, this.setToken);

        this.listaDelegacoesFiltrada = this.listaDelegacoes;
    }

    public async sendDelegacao() {
        const formDelegacao = new FormData();
        formDelegacao.append("nm_delegacao", this.inputNomeDelegacao);
        formDelegacao.append("id_tenant", this.tenant);
        formDelegacao.append("id_municipio", this.municipioSelect);

        await this.postInfo(this.paths.delegacao, formDelegacao, this.setToken);

        this.getDelegacao();
        this.cancelarCadastro();
    }

    public cancelarCadastro() {
        this.inputNomeDelegacao = "";
        this.estadoSelect = "";
        this.municipioSelect = "";
    }

    public cancelarEdicao(item) {
        item.mostrarEditarDelegacao = false;
    }

    public mostrarEdicaoDelegacao(item, listaDelegacoes) {
        listaDelegacoes.forEach((element) => {
            element.mostrarEditarDelegacao = false;
        });
        item.mostrarEditarDelegacao = true;
        // this.inputEditarDelegacao = item.nm_delegacao;
        // this.editarEstadoSelect = item.id_municipio.estado.id;
        // this.editarMunicipioSelect = item.id_municipio.id;

        // this.getMunicipio(this.editarEstadoSelect);
        this.getMunicipio(item.id_municipio.estado.id);
    }

    public async editarDelegacao(item) {
        this.idDelegacao = item.id;
        const path = this.paths.delegacao + `/${this.idDelegacao}`;

        const formEditarDelegacao = new FormData();
        formEditarDelegacao.append("nm_delegacao", item.nm_delegacao);
        formEditarDelegacao.append("id_tenant", this.tenant);
        formEditarDelegacao.append("id_municipio", item.id_municipio.id);

        await this.putInfo(path, formEditarDelegacao, this.setToken);

        this.idDelegacao = "";
        this.getDelegacao();
    }

    public async excluir(item) {
        this.idDelegacao = item.id;

        const path = this.paths.delegacao + `/${this.idDelegacao}`;

        await this.deleteInfo(path, this.setToken);

        this.idDelegacao = "";
        this.getDelegacao();
    }
}
