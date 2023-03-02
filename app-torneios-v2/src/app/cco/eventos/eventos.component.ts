import { Component, OnInit } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";

@Component({
    selector: "app-eventos",
    templateUrl: "./eventos.component.html",
    styleUrls: ["./eventos.component.css"],
})
export class EventosComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public urlGet = `${this.baseUrl}/evento/t${this.tenant}`;
    public urlPost = `${this.baseUrl}/evento/`;

    public headers = {
        Authorization: this.getToken,
        "Content-Type": "application/json",
    };
    public setToken = { headers: this.headers };

    public novoCadastro: boolean = false;
    public editar: boolean = false;
    public editarModalidadeEvento: boolean = false;
    public mostrarEditarEncarregados: boolean = false;
    public mostrarEditarMunicipios: boolean = false;

    public listaEventos: Array<{ id: string; nm_evento: string; dt_inicio: string; dt_fim: string; nm_tenant: string }> = [];
    public listaEventosFiltrado: Array<{ id: string; nm_evento: string; dt_inicio: string; dt_fim: string; nm_tenant: string }> = [];
    public listaEstado: Array<{}> = JSON.parse(localStorage.getItem("listaEstados"));
    public listaCargosCco: Array<{}> = [];
    public listaTiposDocumentos: Array<{}> = [];
    public listaOcupantes: Array<{}> = [];
    public listaMunicipios: Array<{}> = [];
    public listaMunicipiosEvento: Array<{}> = [];
    public listaModalidades: Array<{}> = [];
    public listaModalidadesEvento: Array<{}> = [];
    public listaNaipe: Array<{}> = [];

    public inputNomeEvento: string = "";
    public inputDataInicio: string = "";
    public inputDataFim: string = "";
    public inputNomeTenant: string = "";
    public inputNomeOcupante: string = "";
    public inputNumeroDocumento: string = "";
    public inputIdadeInicial: string = "";
    public inputIdadeFinal: string = "";
    public inputEditarIdadeInicial: string = "";
    public inputEditarIdadeFinal: string = "";

    public cargoSelect = "";
    public estadoSelect = "";
    public municipioSelect = "";
    public documentoSelect = "";
    public modalidadeSelect = "";
    public naipeSelect = "";
    public editarModalidadeSelect = "";
    public editarNaipeSelect = "";

    public idEditarEvento = "";
    public idEvento = "";
    public idRegistroModalidade = "";

    ngOnInit(): void {
        this.getEventos();
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public botaoAvancar() {
        if (this.num == "") {
            if (this.editar) {
                this.sendEventos("put");
            } else {
                this.sendEventos("post");
            }
        } else if (this.num == "1") {
            if (this.listaModalidadesEvento.length > 0) {
                this.num = "2";
            } else {
                alert("cadastre uma modalidade");
            }
        } else if (this.num == "2") {
            if (this.listaOcupantes.length > 0) {
                this.num = "3";
            } else {
                alert("cadastre um encarregado");
            }
        } else if (this.num == "3") {
            alert("informações salvas");
            this.num = "";
            this.finalizarCadastro();
        }
    }
    public botaoVoltar() {
        if (this.num == "") {
            this.limparFormEvento();
            this.finalizarCadastro();
        } else if (this.num == "1") {
            this.editar = true;
            this.num = "";
        } else if (this.num == "2") {
            this.num = "1";
        } else if (this.num == "3") {
            this.num = "2";
        }
    }

    public finalizarCadastro() {
        this.idEvento = "";
        this.novoCadastro = false;
        this.editar = false;
    }

    public cancelar(tela, item) {
        if (tela == "evento") {
            this.inputNomeEvento = "";
            this.inputDataInicio = "";
            this.inputDataFim = "";
            this.inputNomeTenant = "";
            this.novoCadastro = !this.novoCadastro;
        } else if (tela == "modalidades") {
            item.editarModalidadeEvento = false;
            this.editarModalidadeEvento = false;
        } else if (tela == "encarregados") {
            item.mostrarEditarEncarregados = false;
            this.mostrarEditarEncarregados = false;
        } else if (tela == "municipios") {
            item.mostrarEditarMunicipios = false;
            this.mostrarEditarMunicipios = false;
        }
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["id", "nm_evento", "dt_inicio", "dt_fim"];

        this.listaEventosFiltrado = this.filterTable(columns, this.listaEventos, conteudo);
        this.pagAtual = 1;
    }

    public async getEventos() {
        const path = this.paths.evento + `/t${this.tenant}`;
        this.listaEventos = await this.getInfo(path, this.setToken);

        this.listaEventosFiltrado = this.listaEventos;
    }

    public async sendEventos(metodo) {
        const formEventos = new FormData();
        formEventos.append("nm_evento", this.inputNomeEvento);
        formEventos.append("dt_inicio", this.inputDataInicio);
        formEventos.append("dt_fim", this.inputDataFim);
        formEventos.append("id_tenant", this.tenant);
        if (metodo == "post") {
            let sendInfoEvento = await this.postInfo(this.paths.evento, formEventos, this.setToken);
            this.idEvento = sendInfoEvento.id;
        } else if (metodo == "put") {
            const path = this.paths.evento + `/${this.idEvento}`;
            await this.putInfo(path, formEventos, this.setToken);
        }

        if (this.axiosResponse == true) {
            this.num = "1";
            this.getCargosCco();
            this.getModalidades();
            if(this.editar){
                this.getEdits();
            }
        }
    }

    public limparFormEvento() {
        this.inputNomeEvento = "";
        this.inputDataInicio = "";
        this.inputDataFim = "";
        this.inputNomeTenant = "";
    }

    public getEdits() {
        this.getOcupantes();
        this.getModalidadesEvento();
        this.getMunicipiosEvento();
    }

    public async getModalidades() {
        this.listaModalidades = await this.getInfo(this.paths.modalidade, this.setToken);
    }

    public async sendModalidadesEvento(metodo, item) {
        const formModalidadeEvento = new FormData();
        if (metodo == "post") {
            formModalidadeEvento.append("id_tenant", this.tenant);
            formModalidadeEvento.append("id_evento", this.idEvento);
            formModalidadeEvento.append("id_modalidade", this.modalidadeSelect);
            formModalidadeEvento.append("nr_idadeinicio", this.inputIdadeInicial);
            formModalidadeEvento.append("nr_idadefinal", this.inputIdadeFinal);
            formModalidadeEvento.append("tp_naipe", this.naipeSelect);
            await this.postInfo(this.paths.modalidadeevento, formModalidadeEvento, this.setToken);
        } else if (metodo == "put") {
            const formEditarModalidadeEvento = new FormData();
            formEditarModalidadeEvento.append("id_tenant", this.tenant);
            formEditarModalidadeEvento.append("id_evento", this.idEvento);
            formEditarModalidadeEvento.append("id_modalidade", this.editarModalidadeSelect);
            formEditarModalidadeEvento.append("nr_idadeinicio", this.inputEditarIdadeInicial);
            formEditarModalidadeEvento.append("nr_idadefinal", this.inputEditarIdadeFinal);
            formEditarModalidadeEvento.append("tp_naipe", this.editarNaipeSelect);
            const path = this.paths.modalidadeevento + `/${item.id}`;
            await this.putInfo(path, formEditarModalidadeEvento, this.setToken);
        }

        this.modalidadeSelect = "";
        this.inputIdadeInicial = "";
        this.inputIdadeFinal = "";
        this.naipeSelect = "";
        this.getModalidadesEvento();
    }

    public async getModalidadesEvento() {
        const path = this.paths.modalidadeevento + `/i${this.idEvento}&t${this.tenant}`;

        this.listaModalidadesEvento = await this.getInfo(path, this.setToken);
    }

    public limparFormModalidade() {
        this.modalidadeSelect = "";
        this.inputIdadeInicial = "";
        this.inputIdadeFinal = "";
        this.naipeSelect = "";
    }

    public async getCargosCco() {
        const path = this.paths.cargocco + `/t${this.tenant}`;

        this.listaCargosCco = await this.getInfo(path, this.setToken);
    }

    public async sendNovoOcupante(metodo, item) {
        const formOcupante = new FormData();
        if (metodo == "post") {
            formOcupante.append("id_tenant", this.tenant);
            formOcupante.append("id_evento", this.idEvento);
            formOcupante.append("id_cargocco", this.cargoSelect);
            formOcupante.append("nm_ocupante", this.inputNomeOcupante);
            formOcupante.append("tp_documento", this.documentoSelect);
            formOcupante.append("nr_documento", this.inputNumeroDocumento);
            await this.postInfo(this.paths.ccoevento, formOcupante, this.setToken);
            this.limparFormOcupante();
        } else if (metodo == "put") {
            formOcupante.append("id_tenant", this.tenant);
            formOcupante.append("id_evento", this.idEvento);
            formOcupante.append("id_cargocco", item.id_cargocco.id);
            formOcupante.append("nm_ocupante", item.nm_ocupante);
            formOcupante.append("tp_documento", item.tp_documento);
            formOcupante.append("nr_documento", item.nr_documento);

            const path = this.paths.ccoevento + `/${item.id}`;
            await this.putInfo(path, formOcupante, this.setToken);
        }
        this.getOcupantes();
    }

    public limparFormOcupante() {
        this.cargoSelect = "";
        this.inputNomeOcupante = "";
        this.documentoSelect = "";
        this.inputNumeroDocumento = "";
    }

    public async getOcupantes() {
        const path = this.paths.ccoevento + `/i${this.idEvento}&t${this.tenant}`;
        this.listaOcupantes = await this.getInfo(path, this.setToken);
    }

    public async getMunicipio(metodo, item) {
        if (metodo == "criar") {
            const path = this.paths.municipio + `/${this.estadoSelect}`;
            this.listaMunicipios = await this.getInfo(path, this.setToken);
        } else if (metodo == "editar") {
            const path = this.paths.municipio + `/${item}`;
            this.listaMunicipios = await this.getInfo(path, this.setToken);
        }
    }

    public async cadastrarNovoMunicipio(metodo, item) {
        const formMunicipioEvento = new FormData();

        if (metodo == "post") {
            formMunicipioEvento.append("id_tenant", this.tenant);
            formMunicipioEvento.append("id_evento", this.idEvento);
            formMunicipioEvento.append("id_municipio", this.municipioSelect);
            await this.postInfo(this.paths.municipioevento, formMunicipioEvento, this.setToken);
        } else if (metodo == "put") {
            formMunicipioEvento.append("id_tenant", this.tenant);
            formMunicipioEvento.append("id_evento", item.id_evento.id);
            formMunicipioEvento.append("id_municipio", item.id_municipio.id);
            const path = this.paths.municipioevento + `/${item.id}`;
            await this.putInfo(path, formMunicipioEvento, this.setToken);
        }

        this.getMunicipiosEvento();
    }

    public async getMunicipiosEvento() {
        const path = this.paths.municipioevento + `/i${this.idEvento}&t${this.tenant}`;

        this.listaMunicipiosEvento = await this.getInfo(path, this.setToken);
    }

    public limparFormMunicipio() {
        this.estadoSelect = "";
        this.municipioSelect = "";
    }

    public async editarEvento(item) {
        this.novoCadastro = true;
        this.editar = true;
        this.idEvento = item.id;

        const path = this.paths.evento + `/i${item.id}&t${this.tenant}`;

        let getInfoEvento = await this.getInfo(path, this.setToken);

        this.inputNomeEvento = getInfoEvento[0].nm_evento;
        this.inputDataInicio = getInfoEvento[0].dt_inicio;
        this.inputDataFim = getInfoEvento[0].dt_fim;
    }

    public mostrarEditarModalidade(item) {
        item.editarModalidadeEvento = true;
        this.editarModalidadeSelect = item.id_modalidade.id;
        this.inputEditarIdadeInicial = item.nr_idadeinicio;
        this.inputEditarIdadeFinal = item.nr_idadefinal;
        this.editarNaipeSelect = item.tp_naipe;
    }

    public editarEncarregados(item) {
        item.mostrarEditarEncarregados = true;
    }

    public editarMunicipiosEvento(item) {
        item.mostrarEditarMunicipios = true;
        this.mostrarEditarMunicipios = true;
        this.limparFormMunicipio();
        this.getMunicipio("editar", item.id_municipio.estado.id);
    }

    public async excluir(item, tela) {
        const type = "warning-message-and-cancel";
        if (tela == "evento") {
            this.mensagemTitulo = "Deseja deletar o evento?";
            this.mensagemAlerta = "Esta ação não será reversível e irá deletar todos os registros relacionados ao evento!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.evento + `/${item.id}`;
                await this.deleteInfo(path, this.setToken);
                this.getEventos();
            }
        } else if (tela == "modalidades") {
            this.mensagemTitulo = "Deseja deletar a modalidade deste evento?";
            this.mensagemAlerta = "Esta ação não será reversível!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.modalidadeevento + `/${item.id}`;
                await this.deleteInfo(path, this.setToken);
                this.getModalidadesEvento();
            }
        } else if (tela == "cargos") {
            this.mensagemTitulo = "Deseja deletar o encarregado deste evento?";
            this.mensagemAlerta = "Esta ação não será reversível!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.ccoevento + `/${item.id}`;
                await this.deleteInfo(path, this.setToken);
                this.getOcupantes();
            }
        } else if (tela == "municipios") {
            this.mensagemTitulo = "Deseja deletar o município deste evento?";
            this.mensagemAlerta = "Esta ação não será reversível!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.municipioevento + `/${item.id}`;
                await this.deleteInfo(path, this.setToken);
                this.getMunicipiosEvento();
            }
        }
    }
}
