import { Component, OnInit } from "@angular/core";
import axios from "axios";

@Component({
    selector: "lista-atleta",
    templateUrl: "./lista-atleta.component.html",
    styleUrls: ["./lista-atleta.component.css"],
})
export class ListaAtletaComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    // public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public headers = { Authorization: this.getToken };
    public setToken = { headers: this.headers };

    public listaAtletas: Array<{ id: string; nm_atleta: string; nm_apelido: string; dt_nascimento: string; tp_genero: string; ds_endereco: string; nr_endereco: string; nr_cep: string; id_estado: string; id_municipio: string }> = [];

    constructor() {}

    ngOnInit(): void {
        this.getListaAtletas();
    }

    public async getListaAtletas() {
        const url = `${this.baseUrl}/atleta`;

        let getListaAtletas = await axios.get(url, this.setToken);

        this.listaAtletas = getListaAtletas.data.data;
    }
}
