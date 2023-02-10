import { Component, OnInit } from "@angular/core";
import axios from "axios";
declare var $: any;

@Component({
    selector: "delegacao",
    templateUrl: "./delegacao.component.html",
    styleUrls: ["./delegacao.component.css"],
})
export class DelegacaoComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public url = `${this.baseUrl}/delegacao`;

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    public listaDelegacoes: Array<{ id: string; nm_delegacao: string }> = [];
    public listaMunicipios = [];
    public listaEstado = JSON.parse(localStorage.getItem("listaEstados"));

    public inputNomeDelegacao: string = "";
    public inputTipoDelegacao: string = "";
    public idDelegacao = "";
    public estadoSelect = "";
    public municipioSelect = "";

    public novoCadastro = false;
    public mostrarEditarDelegacao = false;

    constructor() {}

    ngOnInit(): void {
        this.getDelegacao();
    }

    public async getMunicipio() {
        let url = `${this.baseUrl}/municipio/${this.estadoSelect}`;

        let municipioDelegacao = await axios.get(url, this.setToken);

        this.listaMunicipios = municipioDelegacao.data.data;
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async getDelegacao() {
        let getInfo = await axios.get(this.url, this.setToken);

        this.listaDelegacoes = getInfo.data.data;
    }

    public async sendDelegacao() {
        this.formError();

        try {
            const formDelegacao = new FormData();
            formDelegacao.append("nm_delegacao", this.inputNomeDelegacao.toUpperCase());
            formDelegacao.append("id_tenant", this.tenant.toUpperCase());
            formDelegacao.append("id_municipio", this.municipioSelect.toUpperCase());

            let sendInfo = await axios.post(this.url, formDelegacao, this.setToken);

            this.getDelegacao();
            this.cancelarCadastro();
        } catch (error) {
            this.mostrarErros(error);
        }
    }

    public cancelarCadastro() {
        this.inputNomeDelegacao = "";
        this.estadoSelect = "";
        this.municipioSelect = "";
    }

    public mostrarEdicaoDelegacao(item) {
        item.mostrarEditarDelegacao = true;
    }

    public async editarDelegacao(item) {
        try {
            this.idDelegacao = item.id;

            let urlPut = `${this.baseUrl}/delegacao/${this.idDelegacao}`;

            const formEditarDelegacao = new FormData();
            formEditarDelegacao.append("nm_delegacao", item.nm_delegacao.toUpperCase());

            let putInfo = await axios.put(urlPut, formEditarDelegacao, this.setToken);

            this.getDelegacao();
        } catch (error) {
            console.log(error);
        }
    }

    public formError() {
        var formError = document.getElementsByClassName("form-error");

        for (let i = 0; i < formError.length; i++) {
            formError[i].classList.remove("text-danger");
            formError[i].innerHTML = "";
        }
    }

    public mostrarErros(error) {
        var erros = error.response.data.data;
        for (let i = 0; i < erros.length; i++) {
            var span = document.getElementsByClassName(erros[i].campo)[0];

            span.innerHTML = erros[i].mensagem;
            span.classList.add("text-danger");
        }
        this.showNotification("bottom", "center", error.response.data.message, "danger");
    }

    public showNotification(from, align, message, type) {
        $.notify(
            {
                icon: "add_alert",
                message: message,
            },
            {
                type: type,
                timer: 4000,
                placement: {
                    from: from,
                    align: align,
                },
            }
        );
    }
}
