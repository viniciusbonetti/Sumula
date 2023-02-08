import { Component, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import axios from "axios";
import * as Chartist from "chartist";

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

    public novaEmpresa: boolean = false;
    public novaEmpresaNome: string = "";
    public novaEmpresaImg:any  = "";

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
        this.novaEmpresa = true;
    }

    public async confirmarNovaEmpresa() {
        const url = `${this.baseUrl}/tenant`;
        
        const formData = new FormData();
        formData.append("ds_midia", this.novaEmpresaImg);
        formData.append("nm_tenant", this.novaEmpresaNome);

        let sendInfoNovaEmpresa = await axios.post(url, formData, this.setToken);
    }

    public AdicionarNovaEmpresa(event) {
        const file = event.target.files[0];
        this.novaEmpresaImg = file;       
    }

    public async getEstado(){
        let url = `${this.baseUrl}/estado`;

        let estados = await axios.get(url, this.setToken);

        this.listaEstados = estados.data.data
        
        localStorage.setItem("listaEstados", JSON.stringify(this.listaEstados));
    }
}
