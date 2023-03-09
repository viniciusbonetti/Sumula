import { Component, Inject, OnInit } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
    nomeEventoModal: string;
    inicioEventoModal: string;
    fimEventoModal: string;
    modalidadesEventoModal: string;
    encarregadosEventoModal: string;
    municipiosEventoModal: string;
}

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
    public liberarProximo: boolean = false;
    public ativarTabs:boolean = false;
    public mostrarEditarLocalidade:boolean = false;

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
    public listaLocalidades: Array<{}> = [];
    public listaLocalidadesEvento: Array<{}> = [];

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
    public enderecoLocalidade: string = "";

    public cargoSelect = "";
    public estadoSelect = "";
    public municipioSelect = "";
    public documentoSelect = "";
    public modalidadeSelect = "";
    public naipeSelect = "";
    public editarModalidadeSelect = "";
    public editarNaipeSelect = "";
    public localidadeSelect = "";
    public localEndereco = "";
    public editarLocalEndereco = "";
    public editarEstadoSelectLocalidade = "";
    public editarMunicipioSelectLocalidade = "";
    public editarLocalidadeSelect = "";
    public editarEstadoSelectMunicipios = "";
    public editarMunicipioSelectMunicipios = "";

    public idEditarEvento = "";
    public idEvento = "";
    public idRegistroModalidade = "";

    constructor(public dialog: MatDialog) {
        super();
    }

    ngOnInit(): void {
        this.getEventos();
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async botaoAvancar() {        
        let tabHeaders = document.getElementsByClassName("tabHeader");
        let tabPanes = document.getElementsByClassName("tab-pane");
        let nextIndex: number = 0;
        let tabIndex: number = 0;
        let tabPaneAtual = "";
        let tabPaneNext = "";
        

        if (this.num == "") {
            if (this.editar) {
                await this.sendEventos("put");
            } else {
                await this.sendEventos("post");
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
            if(this.listaMunicipiosEvento.length > 0){
                this.num = '4';
            }else {
                alert('cadastre um municipio');
            }
        }else if(this.num == '4'){
            if(this.listaLocalidadesEvento.length >0){
                alert("informações salvas");
                await this.limparFormEvento();
                await this.finalizarCadastro();
                this.num = "";
            }else {
                alert('cadastre uma localidade')
            }
        }

        Array.from(tabPanes).forEach(function (tab, index) {
            if (tab.classList.contains("active")) {
                tabIndex = index;
                nextIndex = index + 1;
            }
        });

        if (nextIndex < tabPanes.length && this.liberarProximo == true) {
            tabPaneAtual = tabHeaders[tabIndex].getAttribute("href").replace("#", "");
            tabPaneNext = tabHeaders[nextIndex].getAttribute("href").replace("#", "");
            // Remove os ativos do elemento atual
            tabHeaders[tabIndex].setAttribute("aria-selected", "false");
            tabHeaders[tabIndex].classList.remove("active");
            document.getElementById(tabPaneAtual).classList.remove("active");
            // Adiciona os ativos no elemento proximo
            tabHeaders[nextIndex].setAttribute("aria-selected", "true");
            tabHeaders[nextIndex].classList.add("active");
            document.getElementById(tabPaneNext).classList.add("active");
        }
    }

    public async botaoVoltar() {
        let tabHeaders = document.getElementsByClassName("tabHeader");
        let tabPanes = document.getElementsByClassName("tab-pane");
        let prevIndex: number = 0;
        let tabIndex: number = 0;
        let tabPaneAtual = "";
        let tabPanePrev = "";

        Array.from(tabPanes).forEach(function (tab, index) {
            if (tab.classList.contains("active")) {
                tabIndex = index;
                prevIndex = index - 1;
            }
        });

        if (prevIndex >= 0) {
            tabPaneAtual = tabHeaders[tabIndex].getAttribute("href").replace("#", "");
            tabPanePrev = tabHeaders[prevIndex].getAttribute("href").replace("#", "");
            // Remove os ativos do elemento atual
            tabHeaders[tabIndex].setAttribute("aria-selected", "false");
            tabHeaders[tabIndex].classList.remove("active");
            document.getElementById(tabPaneAtual).classList.remove("active");
            // Adiciona os ativos no elemento proximo
            tabHeaders[prevIndex].setAttribute("aria-selected", "true");
            tabHeaders[prevIndex].classList.add("active");
            document.getElementById(tabPanePrev).classList.add("active");
        }

        if (this.num == "") {
            await this.limparFormEvento();
            await this.finalizarCadastro();
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
        this.ativarTabs = false;
        this.liberarProximo = false;
    }

    public async cancelar(tela, item) {
        if (tela == "evento") {
            await this.limparFormEvento();
            await this.finalizarCadastro();
        } else if (tela == "modalidades") {
            item.editarModalidadeEvento = false;
            this.editarModalidadeEvento = false;
        } else if (tela == "encarregados") {
            item.mostrarEditarEncarregados = false;
            this.mostrarEditarEncarregados = false;
        } else if (tela == "municipios") {
            item.mostrarEditarMunicipios = false;
            this.mostrarEditarMunicipios = false;
        } else if(tela == 'localidades'){
            item.mostrarEditarLocalidade = false;
            this.mostrarEditarLocalidade = false;
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
        let resposta = await this.getInfo(path, this.setToken);
        this.listaEventos = resposta.data.data;
        if(resposta.status == 200){
            this.listaEventosFiltrado = this.listaEventos;
        }
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
            this.showToast("bottom", "Registro de Evento criado com sucesso!", "success");
        } else if (metodo == "put") {
            const path = this.paths.evento + `/${this.idEvento}`;
            await this.putInfo(path, formEventos, this.setToken);
            this.showToast("bottom", "Registro de Evento atualizado com sucesso!", "success");
        }
        
        if (this.axiosResponse == true) {
            this.num = "1";
            this.liberarProximo = true;
            this.getCargosCco();
            this.getModalidades();
            if (this.editar) {
                this.getEdits();
            }
        }
    }

    public async limparFormEvento() {
        this.inputNomeEvento = "";
        this.inputDataInicio = "";
        this.inputDataFim = "";
        this.inputNomeTenant = "";
        this.listaModalidadesEvento = [];
        this.listaOcupantes = [];
        this.listaMunicipiosEvento = [];

        this.limparFormModalidade();
        this.limparFormOcupante();
        this.limparFormMunicipio();
        this.limparEditarLocalidadeEvento();
    }

    public async getEdits() {
        if (this.editar) {
            this.getModalidadesEvento();
            this.getMunicipiosEvento();
            this.getOcupantes();
            this.getLocalidadesEvento();
        } else {
            await this.getModalidadesEvento();
            await this.getMunicipiosEvento();
            await this.getOcupantes();
            await this.getLocalidadesEvento();
        }
        this.getModalidades();
        this.getCargosCco();
    }

    public async getModalidades() {
        let resposta = await this.getInfo(this.paths.modalidade, this.setToken);
        if(resposta.status == 200){
            this.listaModalidades = resposta.data.data;
        }
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
            this.showToast("bottom", "Modalidades de Evento criadas com sucesso!", "success");
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
            this.showToast("bottom", "Modalidades de Evento atualizadas com sucesso!", "success");
        }

        this.modalidadeSelect = "";
        this.inputIdadeInicial = "";
        this.inputIdadeFinal = "";
        this.naipeSelect = "";
        this.getModalidadesEvento();
    }

    public async getModalidadesEvento() {
        this.listaModalidadesEvento = [];
        const path = this.paths.modalidadeevento + `/i${this.idEvento}&t${this.tenant}`;

        let resposta = await this.getInfo(path, this.setToken);

        if (resposta.status == 200) {
            this.listaModalidadesEvento = resposta.data.data;
        }
    }

    public limparFormModalidade() {
        this.modalidadeSelect = "";
        this.inputIdadeInicial = "";
        this.inputIdadeFinal = "";
        this.naipeSelect = "";
    }

    public async getCargosCco() {
        const path = this.paths.cargocco + `/t${this.tenant}`;

        let resposta = await this.getInfo(path, this.setToken);
        if(resposta.status == 200){
            this.listaCargosCco = resposta.data.data;
        }
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
            this.showToast("bottom", "Registro de Ocupante criado com sucesso!", "success");
        } else if (metodo == "put") {
            formOcupante.append("id_tenant", this.tenant);
            formOcupante.append("id_evento", this.idEvento);
            formOcupante.append("id_cargocco", item.id_cargocco.id);
            formOcupante.append("nm_ocupante", item.nm_ocupante);
            formOcupante.append("tp_documento", item.tp_documento);
            formOcupante.append("nr_documento", item.nr_documento);

            const path = this.paths.ccoevento + `/${item.id}`;
            await this.putInfo(path, formOcupante, this.setToken);
            this.showToast("bottom", "Registro de Ocupante atualizado com sucesso!", "success");
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
        this.listaOcupantes = [];
        const path = this.paths.ccoevento + `/i${this.idEvento}&t${this.tenant}`;
        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaOcupantes = resposta.data.data;
        }
    }

    public async getMunicipio(metodo, item) {
        this.municipioSelect = '';

        this.editarMunicipioSelectMunicipios = '';

        this.editarEstadoSelectLocalidade = '';
        this.editarMunicipioSelectLocalidade = '';
        
        let resposta;
        if (metodo == "criar") {
            const path = this.paths.municipio + `/${this.estadoSelect}`;
            resposta = await this.getInfo(path, this.setToken);
        } else if (metodo == "editar") {
            const path = this.paths.municipio + `/${item}`;
            resposta = await this.getInfo(path, this.setToken);
        }
        
        
        if(resposta.status == 200){
            this.listaMunicipios = resposta.data.data;
        }
    }

    public async cadastrarNovoMunicipio(metodo, item) {
        const formMunicipioEvento = new FormData();

        if (metodo == "post") {
            formMunicipioEvento.append("id_tenant", this.tenant);
            formMunicipioEvento.append("id_evento", this.idEvento);
            formMunicipioEvento.append("id_municipio", this.municipioSelect);
            await this.postInfo(this.paths.municipioevento, formMunicipioEvento, this.setToken);
            this.showToast("bottom", "Municipio do Evento criado com sucesso!", "success");
        } else if (metodo == "put") {
            formMunicipioEvento.append("id_tenant", this.tenant);
            formMunicipioEvento.append("id_evento", item.id_evento.id);
            formMunicipioEvento.append("id_municipio", item.id_municipio.id);
            const path = this.paths.municipioevento + `/${item.id}`;
            await this.putInfo(path, formMunicipioEvento, this.setToken);
            this.mostrarEditarMunicipios = false;
            this.showToast("bottom", "Municipio do Evento atualizado com sucesso!", "success");
        }

        this.getMunicipiosEvento();
    }

    public async getMunicipiosEvento() {
        this.listaMunicipiosEvento = [];
        const path = this.paths.municipioevento + `/i${this.idEvento}&t${this.tenant}`;

        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaMunicipiosEvento = resposta.data.data;
        }
    }

    public limparFormMunicipio() {
        this.estadoSelect = "";
        this.municipioSelect = "";
    }

    public tabs(index) {
        this.num = index;
    }

    public async editarEvento(item, opcao) {
        this.idEvento = item.id;

        this.inputNomeEvento = item.nm_evento;
        this.inputDataInicio = item.dt_inicio;
        this.inputDataFim = item.dt_fim;

        if (opcao == "editar") {
            this.novoCadastro = true;
            this.ativarTabs = true;
            this.editar = true;
            this.ativarTabs = true;
            await this.getEdits();
        } else if (opcao == "mostrar") {
            await this.getEdits();
            await this.openDialog(item);
        }
    }

    public mostrarEditarModalidade(item, lista) {
        lista.forEach((element) => {
            element.editarModalidadeEvento = false;
        });
        item.editarModalidadeEvento = true;
        this.editarModalidadeSelect = item.id_modalidade.id;
        this.inputEditarIdadeInicial = item.nr_idadeinicio;
        this.inputEditarIdadeFinal = item.nr_idadefinal;
        this.editarNaipeSelect = item.tp_naipe;
    }

    public editarEncarregados(item, lista) {
        lista.forEach((element) => {
            element.mostrarEditarEncarregados = false;
        });
        item.mostrarEditarEncarregados = true;
    }

    public async editarMunicipiosEvento(item, lista) {        
        lista.forEach((element) => {
            element.mostrarEditarMunicipios = false;
        });
        item.mostrarEditarMunicipios = true;
        this.mostrarEditarMunicipios = true;
        this.limparFormMunicipio();
        await this.getMunicipio("editar", item.id_municipio.estado.id);
        this.editarEstadoSelectMunicipios = item.id_municipio.estado.id;
        this.editarMunicipioSelectMunicipios = item.id_municipio.id;
    }

    public async getLocalidades(metodo, item){
        let resposta;
        this.editarLocalidadeSelect = '';
        
        if (metodo == "criar") {
            const path = this.paths.localidades + `/m${this.municipioSelect}&t${this.tenant}`;
            resposta = await this.getInfo(path, this.setToken);
        } else if (metodo == "editar") {
            const path = this.paths.localidades + `/m${item}&t${this.tenant}`;
            resposta = await this.getInfo(path, this.setToken);
        }
        
        if(resposta.status == 200){
            this.listaLocalidades = resposta.data.data;
        }
    }

    public async cadastrarLocalidadeEvento(metodo, item){
        const formLocalidadeEvento = new FormData();        
        formLocalidadeEvento.append('id_evento', this.idEvento);
        if(metodo == 'post'){
            formLocalidadeEvento.append('id_localidade', this.localidadeSelect);
            await this.postInfo(this.paths.localidadeevento, formLocalidadeEvento, this.setToken);
            this.showToast("bottom", "Localidade do evento criado com sucesso!", "success");
        }else if(metodo == 'put'){            
            formLocalidadeEvento.append('id_localidade', this.editarLocalidadeSelect);
            const path = this.paths.localidadeevento + `/${item.id}`;
            await this.putInfo(path, formLocalidadeEvento, this.setToken);
        }

        if(this.axiosResponse == true){
            this.limparFormLocalidadeEvento();
            this.getLocalidadesEvento();
        }
    }
    
    public async getLocalidadesEvento(){
        this.listaLocalidadesEvento = [];
        const path = this.paths.localidadeevento + `/t${this.idEvento}`;
        
        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaLocalidadesEvento = resposta.data.data;            
        }
    }

    public async editarLocalidadeEvento(item, lista){
        lista.forEach((element) => {
            element.mostrarEditarLocalidade = false;
        });
        item.mostrarEditarLocalidade = true;
        this.mostrarEditarLocalidade = true;
        this.limparFormLocalidadeEvento();
        await this.getMunicipio("editar", item.id_localidade.municipio.id_estado);
        await this.getLocalidades("editar", item.id_localidade.id_municipio);
        
        
        this.editarEstadoSelectLocalidade = item.id_localidade.municipio.id_estado;
        this.editarMunicipioSelectLocalidade = item.id_localidade.id_municipio;
        this.editarLocalidadeSelect = item.id_localidade.id;
        
        
        this.setEnderecoLocalidade(item.id_localidade.id, 'editar');
    }

    public limparEditarLocalidadeEvento(){
        this.editarEstadoSelectLocalidade = '';
        this.editarMunicipioSelectLocalidade = '';
        this.editarLocalidadeSelect = '';
    }

    public setEnderecoLocalidade(event, metodo){
        this.listaLocalidades.forEach(localidades => {
            if(localidades['id'] == event){
                if(metodo == 'criar'){
                    this.localEndereco = localidades['ds_endereco'] + ', ' + localidades['nr_localidade'] + ' - ' + localidades['ds_bairro'];
                    this.localEndereco = this.localEndereco.toLocaleUpperCase();
                } else if(metodo == 'editar'){
                    this.editarLocalEndereco = localidades['ds_endereco'] + ', ' + localidades['nr_localidade'] + ' - ' + localidades['ds_bairro'];
                    this.editarLocalEndereco = this.editarLocalEndereco.toLocaleUpperCase();
                }
            }
        });
    }
    
    public limparFormLocalidadeEvento(){
        this.estadoSelect = '';
        this.municipioSelect = '';
        this.localidadeSelect = '';
        this.localEndereco = '';
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
        } else if(tela == 'localidades'){
            this.mensagemTitulo = "Deseja deletar o município deste evento?";
            this.mensagemAlerta = "Esta ação não será reversível!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.localidadeevento + `/${item.id}`;
                await this.deleteInfo(path, this.setToken);
                this.getLocalidadesEvento();
            }
        }
    }

    openDialog(item) {
        const dialogRef = this.dialog.open(EventosModal, {
            data: {
                nomeEventoModal: item.nm_evento,
                inicioEventoModal: item.dt_inicio,
                fimEventoModal: item.dt_fim,
                modalidadesEventoModal: this.listaModalidadesEvento,
                encarregadosEventoModal: this.listaOcupantes,
                municipiosEventoModal: this.listaMunicipiosEvento,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.editarEvento(item, "editar");
            } else {
                this.limparFormEvento();
            }
        });
    }
}

@Component({
    selector: "eventos-modal",
    templateUrl: "EventosModal.html",
})
export class EventosModal {
    constructor(public dialogRef: MatDialogRef<EventosModal>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
    ngOnInit() {}
}
