import { AfterContentInit, DoCheck, Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import axios, { formToJSON } from "axios";
declare var $: any;

@Component({
    selector: "app-table-list",
    templateUrl: "./table-list.component.html",
    styleUrls: ["./table-list.component.css"],
})
export class TableListComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public urlGet = `${this.baseUrl}/evento/t${this.tenant}`;
    public urlPost = `${this.baseUrl}/evento/`;

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    public novoCadastro = false;
    public mostrarEditarModalidade = false;

    public listaEventos: Array<{ id: string; nm_evento: string; dt_inicio: string; dt_fim: string; nm_tenant: string }> = [];
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

    public cargoSelect = "";
    public estadoSelect = "";
    public municipioSelect = "";
    public documentoSelect = "";
    public modalidadeSelect = "";
    public naipeSelect = "";

    public idEditEvento = "";
    public idEvento = "";

    public num = "";

    public formError = document.getElementsByClassName("form-error");

    constructor() {}

    ngOnInit(): void {
        this.getEventos();
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async getEventos() {
        let getInfo = await axios.get(this.urlGet, this.setToken);

        this.listaEventos = getInfo.data.data;
    }

    public async sendEventos() {
        for (let i = 0; i < this.formError.length; i++) {
            this.formError[i].classList.remove("text-danger");
            this.formError[i].innerHTML = "";
        }

        try {
            const formEventos = new FormData();
            formEventos.append("nm_evento", this.inputNomeEvento);
            formEventos.append("dt_inicio", this.inputDataInicio);
            formEventos.append("dt_fim", this.inputDataFim);
            formEventos.append("id_tenant", this.tenant);

            let sendInfoEventos = await axios.post(this.urlPost, formEventos, this.setToken);

            this.idEvento = sendInfoEventos.data.data.id;

            this.inputNomeEvento = "";
            this.inputDataInicio = "";
            this.inputDataFim = "";
            this.inputNomeTenant = "";

            
            this.getModalidades();
            this.getCargosCco();
            this.num = "1";
        } catch (error) {
            var erros = error.response.data.data;

            for (let i = 0; i < erros.length; i++) {
                var span = document.getElementsByClassName(erros[i].campo)[0];

                span.innerHTML = erros[i].mensagem;
                span.classList.add("text-danger");
            }
            this.showNotification("bottom", "center", error.response.data.message, "danger");
        }
    }

    public cancelarCadastro() {
        this.inputNomeEvento = "";
        this.inputDataInicio = "";
        this.inputDataFim = "";
        this.inputNomeTenant = "";
        this.novoCadastro = !this.novoCadastro;
    }

    public mostrarEdicaoEventos(item) {
        item.mostrarEditarEventos = true;
    }

    public async editarEventos(item) {
        for (let i = 0; i < this.formError.length; i++) {
            this.formError[i].classList.remove("text-danger");
            this.formError[i].innerHTML = "";
        }

        try {
            this.idEditEvento = item.id;

            let urlPut = `${this.baseUrl}/modalidade/${this.idEditEvento}`;

            const formEditarModalidade = new FormData();
            formEditarModalidade.append("nm_evento", item.nm_evento);
            formEditarModalidade.append("dt_inicio", item.dt_inicio);
            formEditarModalidade.append("dt_fim", item.dt_fim);
            formEditarModalidade.append("nm_tenant", item.nm_tenant);

            let putInfo = await axios.put(urlPut, formEditarModalidade, this.setToken);

            this.getEventos();
        } catch (error) {
            var erros = error.response.data.data;

            for (let i = 0; i < erros.length; i++) {
                var span = document.getElementsByClassName(erros[i].campo)[0];

                span.innerHTML = erros[i].mensagem;
                span.classList.add("text-danger");
            }
            this.showNotification("bottom", "center", error.response.data.message, "danger");
        }
    }

    public botaoAvancar() {
        if (this.num == "") {
            this.sendEventos();
        } else if (this.num == "1") {
            if(this.listaModalidadesEvento.length > 0){
                this.num = '2';
            }else {
                this.sendModalidadesEvento();
            }
        }else if(this.num == "2"){
            if(this.listaOcupantes.length > 0){
                this.num = '3';
            }else{
                this.sendNovoOcupante();
            }
        }
    }

    public async getModalidades() {
        const urlGetModalidades = `${this.baseUrl}/modalidade`;

        let getInfoModalidade = await axios.get(urlGetModalidades, this.setToken);

        this.listaModalidades = getInfoModalidade.data.data;
    }

    public async sendModalidadesEvento() {
        const urlSendModalidadeEvento = `${this.baseUrl}/modalidadeevento`;
        for (let i = 0; i < this.formError.length; i++) {
            this.formError[i].classList.remove("text-danger");
            this.formError[i].innerHTML = "";
        }

        try {
            const formModalidadeEvento = new FormData();
            formModalidadeEvento.append("id_tenant", this.tenant);
            formModalidadeEvento.append("id_evento", this.idEvento);
            formModalidadeEvento.append("id_modalidade", this.modalidadeSelect);
            formModalidadeEvento.append("nr_idadeinicio", this.inputIdadeInicial);
            formModalidadeEvento.append("nr_idadefinal", this.inputIdadeFinal);
            formModalidadeEvento.append("tp_naipe", this.naipeSelect);

            let sendInfoModalidade = await axios.post(urlSendModalidadeEvento, formModalidadeEvento, this.setToken);

            this.getModalidadesEvento();
        } catch (error) {
            var erros = error.response.data.data;

            for (let i = 0; i < erros.length; i++) {
                var span = document.getElementsByClassName(erros[i].campo)[0];

                span.innerHTML = erros[i].mensagem;
                span.classList.add("text-danger");
            }
            this.showNotification("bottom", "center", error.response.data.message, "danger");
        }
    }

    public async getModalidadesEvento() {
        const urlGetModalidadeEvento = `${this.baseUrl}/modalidadeevento/i${this.idEvento}&t${this.tenant}`;

        let getInfoModalidadeEvento = await axios.get(urlGetModalidadeEvento, this.setToken);

        this.listaModalidadesEvento = getInfoModalidadeEvento.data.data;
    }

    public async getCargosCco() {
        const urlGetCargos = `${this.baseUrl}/cargocco/t${this.tenant}`;

        let getInfo = await axios.get(urlGetCargos, this.setToken);

        this.listaCargosCco = getInfo.data.data;
    }

    public async sendNovoOcupante() {
        const urlSendOcupante = `${this.baseUrl}/ccoevento`;
        for (let i = 0; i < this.formError.length; i++) {
            this.formError[i].classList.remove("text-danger");
            this.formError[i].innerHTML = "";
        }

        try {
            const formOcupante = new FormData();
            formOcupante.append("id_tenant", this.tenant);
            formOcupante.append("id_evento", this.idEvento);
            formOcupante.append("id_cargocco", this.cargoSelect);
            formOcupante.append("nm_ocupante", this.inputNomeOcupante);
            formOcupante.append("tp_documento", this.documentoSelect);
            formOcupante.append("nr_documento", this.inputNumeroDocumento);

            let postOcupantes = await axios.post(urlSendOcupante, formOcupante, this.setToken);

            this.limparFormOcupante();
            this.getOcupantes();
        } catch (error) {
            var erros = error.response.data.data;

            for (let i = 0; i < erros.length; i++) {
                var span = document.getElementsByClassName(erros[i].campo)[0];

                span.innerHTML = erros[i].mensagem;
                span.classList.add("text-danger");
            }
            this.showNotification("bottom", "center", error.response.data.message, "danger");
        }
    }

    public limparFormOcupante() {
        this.cargoSelect = "";
        this.inputNomeOcupante = "";
        this.documentoSelect = "";
        this.inputNumeroDocumento = "";
    }

    public async getOcupantes() {
        const urlGetOcupantes = `${this.baseUrl}/ccoevento/i${this.idEvento}&t${this.tenant}`;

        let getOcupantes = await axios.get(urlGetOcupantes, this.setToken);

        this.listaOcupantes = getOcupantes.data.data;
    }

    public async getMunicipio() {
        let url = `${this.baseUrl}/municipio/${this.estadoSelect}`;

        let municipio = await axios.get(url, this.setToken);

        this.listaMunicipios = municipio.data.data;
    }

    public async cadastrarNovoMunicipio() {
        const urlSendMunicipioEvento = `${this.baseUrl}/municipioevento`;
        for (let i = 0; i < this.formError.length; i++) {
            this.formError[i].classList.remove("text-danger");
            this.formError[i].innerHTML = "";
        }

        try {
            const formMunicipioEvento = new FormData();
            formMunicipioEvento.append("id_evento", this.idEvento);
            formMunicipioEvento.append("id_municipio", this.municipioSelect);
            formMunicipioEvento.append("id_tenant", this.tenant);

            let sendMunicipioEvento = await axios.post(urlSendMunicipioEvento, formMunicipioEvento, this.setToken);

            this.getMunicipiosEvento();
        } catch (error) {
            var erros = error.response.data.data;

            for (let i = 0; i < erros.length; i++) {
                var span = document.getElementsByClassName(erros[i].campo)[0];

                span.innerHTML = erros[i].mensagem;
                span.classList.add("text-danger");
            }
            this.showNotification("bottom", "center", error.response.data.message, "danger");
        }
    }

    public async getMunicipiosEvento() {
        let url = `${this.baseUrl}/municipioevento/i${this.idEvento}&t${this.tenant}`;

        let municipioEvento = await axios.get(url, this.setToken);

        this.listaMunicipiosEvento = municipioEvento.data.data;
    }

    public showNotification(from, align, message, type) {
        $.notify(
            {
                icon: "add_alert",
                message: message,
            },
            {
                type: type,
                timer: 1000,
                placement: {
                    from: from,
                    align: align,
                },
            }
        );
    }
}
