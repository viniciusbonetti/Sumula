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
    public url = `${this.baseUrl}/delegacao`;

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    public listaDelegacoes: Array<{ id: string; nm_delegacao: string }> = [];
    public listaDelegacoesFiltrada: Array<{}> = [];
    public listaMunicipios: Array<{}> = [];
    public listaMunicipiosEditar: Array<{}> = [];
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
        const columns = ["id", "nm_delegacao", "id_municipio.estado.nm_estado", "id_municipio.nm_municipio"];

        this.listaDelegacoesFiltrada = this.filterTable(columns, this.listaDelegacoes, conteudo);
        this.pagAtual = 1;
    }

    public async getMunicipio(select, opcao) {
        let path = this.paths.municipio + `/${select}`;
        let resposta = await this.getInfo(path, this.setToken);
        if(resposta.status == 200){
            if(opcao == 'criar'){
                this.listaMunicipios = resposta.data.data;
            } else if(opcao == 'editar'){
                this.listaMunicipiosEditar = resposta.data.data;
            }
        }
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async getDelegacao() {
        let resposta = await this.getInfo(this.paths.delegacao, this.setToken);
        if(resposta.status == 200){
            this.listaDelegacoes = resposta.data.data;
            this.listaDelegacoesFiltrada = this.listaDelegacoes;
        }
    }

    public async sendDelegacao() {
        const formDelegacao = new FormData();
        formDelegacao.append("nm_delegacao", this.inputNomeDelegacao);
        formDelegacao.append("id_tenant", this.tenant);
        formDelegacao.append("id_municipio", this.municipioSelect);

        await this.postInfo(this.paths.delegacao, formDelegacao, this.setToken);

        this.getDelegacao();
        this.cancelarCadastro();
        this.showToast("bottom", "Registro de Delegação criado com sucesso!", "success");
    }

    public cancelarCadastro() {
        this.inputNomeDelegacao = "";
        this.estadoSelect = "";
        this.municipioSelect = "";
        this.novoCadastro = false;
    }

    public cancelarEdicao(item) {
        item.mostrarEditarDelegacao = false;
    }

    public mostrarEdicaoDelegacao(item, listaDelegacoes) {
        this.novoCadastro = false;
        listaDelegacoes.forEach((element) => {
            element.mostrarEditarDelegacao = false;
        });
        item.mostrarEditarDelegacao = true;

        this.getMunicipio(item.id_municipio.estado.id, 'editar');
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
        this.showToast("bottom", "Registro de Delegação atualizado com sucesso!", "success");
    }

    public async excluir(item) {
        const type = 'warning-message-and-cancel';
        this.mensagemTitulo = 'Deseja deletar a delegação?'
        this.mensagemAlerta = 'Esta ação não será reversível e irá deletar todos os registros relacionados à delegação!'
        await this.showSwal(type);
        if(this.resultado){
            this.idDelegacao = item.id;
    
            const path = this.paths.delegacao + `/${this.idDelegacao}`;
    
            await this.deleteInfo(path, this.setToken);
    
            this.idDelegacao = "";
            this.getDelegacao();
        }
    }
}
