import { Component, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import axios from "axios";
declare var $: any;

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
    constructor(private router: Router) {}
    public getToken = localStorage.getItem("Authorization");
    public headers = { Authorization: this.getToken };
    public setToken: any = { headers: this.headers };

    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public listaEmpresas: Array<string> = [];

    public novoCadastro: boolean = false;
    public novaEmpresaNome: string = "";
    public novaEmpresaImg: any = "";
    public inputFileTenant = "";

    public itensPagina = 5;
    public pagAtual = 1;

    public listaEstados = {};

    ngOnInit() {
        this.getEmpresas();
        this.getEstado();
    }

    public async getEmpresas() {
        const url = `${this.baseUrl}/tenant`;

        let getInfo = await axios.get(url, this.setToken);

        this.listaEmpresas = getInfo.data.data;
    }

    public async adicionarEmpresa() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async confirmarNovoTenant() {
        const url = `${this.baseUrl}/tenant`;
        var formError = document.getElementsByClassName("form-error");

        for (let i = 0; i < formError.length; i++) {
            formError[i].classList.remove("text-danger");
            formError[i].innerHTML = "";
        }

        try {
            const formData = new FormData();
            formData.append("ds_midia", this.novaEmpresaImg);
            formData.append("nm_tenant", this.novaEmpresaNome.toUpperCase());

            let sendInfoNovaEmpresa = await axios.post(url, formData, this.setToken);

            this.getEmpresas();
            this.limparCadastroTenant();

            this.showNotification("bottom", "center", sendInfoNovaEmpresa.data.message, "success");

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

    public cadastrarImagemTenant(event) {
        const file = event.target.files[0];
        this.novaEmpresaImg = file;
    }

    public limparCadastroTenant() {
        this.novaEmpresaImg = "";
        this.inputFileTenant = "";
        this.novaEmpresaNome = "";
    }

    public async getEstado() {
        let url = `${this.baseUrl}/estado`;

        let estados = await axios.get(url, this.setToken);

        this.listaEstados = estados.data.data;

        localStorage.setItem("listaEstados", JSON.stringify(this.listaEstados));
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
