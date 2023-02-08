import { AfterContentInit, DoCheck, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';


@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit{
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public urlGet = `${this.baseUrl}/evento/t${this.tenant}`;
    public urlPost = `${this.baseUrl}/evento/`;

    public headers = { Authorization:  this.getToken, "Content-Type": "application/json"}
    public setToken = {headers: this.headers}

    public novoCadastro = false;
    public mostrarEditarModalidade = false;

    public listaEventos: Array<{ id: string; nm_evento:string, dt_inicio:string, dt_fim:string, nm_tenant:string}> = [];
    public listaEstado = JSON.parse(localStorage.getItem('listaEstados'));
    public listaCargosCco = [];
    public listaTiposDocumentos = [];
    public listaOcupantes = [];
    public listaMunicipios = [];
    public listaMunicipiosEvento = [];
    public inputNomeEvento: string = '';
    public inputDataInicio: string = '';
    public inputDataFim: string = '';
    public inputNomeTenant: string = '';
    public inputNomeOcupante = '';
    public inputNumeroDocumento = '';
    public idEditEvento = '';
    public idEvento = '';
    public cargoSelect = '';
    public estadoSelect = '';
    public documentoSelect = '';

    public num = '1';

    constructor() {}

    ngOnInit(): void {
        this.getEventos();
    }

    public cadastrar(){
        this.novoCadastro = !this.novoCadastro;
        this.getOcupantes();
    }

    public async getEventos(){
        let getInfo = await axios.get(this.urlGet, this.setToken);

        this.listaEventos = getInfo.data.data;
    }

    public async sendEventos(){
        const formEventos = new FormData();
        formEventos.append('nm_evento', this.inputNomeEvento.toUpperCase());
        formEventos.append('dt_inicio', this.inputDataInicio.toUpperCase());
        formEventos.append('dt_fim', this.inputDataFim.toUpperCase());
        // formEventos.append('nm_tenant', this.listaEventos.nm_tenant.toUpperCase());
        formEventos.append('id_tenant', this.tenant);

        let sendEventos = await axios.post(this.urlPost, formEventos, this.setToken);
        
        this.idEvento = sendEventos.data.data.id;

        this.inputNomeEvento = '';
        this.inputDataInicio = '';
        this.inputDataFim = '';
        this.inputNomeTenant = '';

        this.getEventos();

        this.num = '1';

        this.getCargosCco();
    }

    public cancelarCadastro(){
        this.inputNomeEvento = '';
        this.inputDataInicio = '';
        this.inputDataFim = '';
        this.inputNomeTenant = '';
        this.novoCadastro = !this.novoCadastro;
    }

    public mostrarEdicaoEventos(item){
        item.mostrarEditarEventos = true
    }

    public async editarEventos(item){
        try {
            this.idEditEvento = item.id;
            
            let urlPut = `${this.baseUrl}/modalidade/${this.idEditEvento}`;

            const formEditarModalidade = new FormData();
            formEditarModalidade.append('nm_evento', item.nm_evento.toUpperCase());
            formEditarModalidade.append('dt_inicio', item.dt_inicio.toUpperCase());
            formEditarModalidade.append('dt_fim', item.dt_fim.toUpperCase());
            formEditarModalidade.append('nm_tenant', item.nm_tenant.toUpperCase());
            
            let putInfo = await axios.put(urlPut, formEditarModalidade, this.setToken);

            this.getEventos();
        }
        catch (error) {
            console.log(error);
        }
    }

    public async getCargosCco(){
        const urlGetCargos = `${this.baseUrl}/cargocco/t${this.tenant}`;

        let getInfo = await axios.get(urlGetCargos, this.setToken);

        this.listaCargosCco = getInfo.data.data;
    }

    public async cadastrarNovoOcupante(){
        const urlSendOcupante = `${this.baseUrl}/ccoevento`;

        const formOcupante = new FormData();
        formOcupante.append('id_tenant', this.tenant);
        formOcupante.append('id_evento', this.idEvento);
        formOcupante.append('id_cargocco', this.cargoSelect);
        formOcupante.append('nm_ocupante', this.inputNomeOcupante);
        formOcupante.append('tp_documento', this.documentoSelect);
        formOcupante.append('nr_documento', this.inputNumeroDocumento);

        let postOcupantes = await axios.post(urlSendOcupante,formOcupante, this.setToken);

        this.limparFormOcupante();
        this.getOcupantes();
    }

    public limparFormOcupante(){
        this.cargoSelect = '';
        this.inputNomeOcupante = '';
        this.documentoSelect = '';
        this.inputNumeroDocumento = '';
    }

    public async getOcupantes(){
        const urlGetOcupantes = `${this.baseUrl}/ccoevento`

        let getOcupantes = await axios.get(urlGetOcupantes, this.setToken);

        this.listaOcupantes = getOcupantes.data.data;
    }

    public botaoAvancar(){
        if(this.num == '1'){
            this.num = '2';
        }

        this.getMunicipio();
        this.getMunicipiosEvento();
    }

    public async getMunicipio(){
        let url = `${this.baseUrl}/municipio/${this.estadoSelect}`;

        let municipioEvento = await axios.get(url, this.setToken);

        this.listaMunicipios = municipioEvento.data.data;
    }

    public async getMunicipiosEvento(){
        let url = `${this.baseUrl}/municipioevento/i${this.idEvento}&t${this.tenant}`;

        let municipioEvento = await axios.get(url, this.setToken);

        this.listaMunicipiosEvento = municipioEvento.data.data;
    }
}
