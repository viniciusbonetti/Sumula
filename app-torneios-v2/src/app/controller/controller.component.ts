import { Component, Injectable, OnInit } from "@angular/core";
import axios from "axios";
declare var $: any;

@Component({
    selector: "controller",
    templateUrl: "./controller.component.html",
    styleUrls: ["./controller.component.css"],
})
@Injectable()
export class ControllerComponent implements OnInit {
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public tenant = localStorage.getItem("tenant");

    public paths = {
        atleta: "/atleta",
        cargocco: "/cargocco",
        ccoevento: "/ccoevento",
        contatoatleta: "/contatoatleta",
        delegacao: "/delegacao",
        documentoatleta: "/documentoatleta",
        estado: "/estado",
        evento: "/evento",
        inscricaodelegacao: "/inscricaodelegacao",
        modalidade: "/modalidade",
        modalidadeatleta: "/modalidadeatleta",
        modalidadeevento: "/modalidadeevento",
        municipio: "/municipio",
        municipioevento: "/municipioevento",
        tenant: "/tenant",
        tenantusuario: "/tenantusuario",
        user: "/user",
    }

    ngOnInit(): void {}

    public async getInfo(path, header) {
        this.formError();
        let urlGet = this.baseUrl + path;
        try {
            let getInfo = await axios.get(urlGet, header);
            return getInfo.data.data;
        } catch (error) {
            this.mostrarErros(error);
        }

    }

    public async postInfo(path, form, header){
        this.formError();
        let urlPost = this.baseUrl + path;
        try {
            let sendInfo = await axios.post(urlPost, form, header);
            return sendInfo.data.data;
        } catch (error) {
            this.mostrarErros(error);
        }
    }

    public async putInfo(path, form, header){
        this.formError();
        let urlPut = this.baseUrl + path;
        try {
            let putInfo = await axios.put(urlPut, form, header);
            
            return putInfo;
        } catch (error) {
            this.mostrarErros(error);
            return error;
        }
    }

    public async deleteInfo(path, header){
        this.formError();
        let urlDelete = this.baseUrl + path;
        try {
            let deleteInfo = await axios.delete(urlDelete, header);
            return deleteInfo;
        } catch (error){
            this.mostrarErros(error);
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
            
            span.textContent = erros[i].mensagem;
            
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

    public filterTable(columns, listaOriginal, searchContent){
        let listaFiltrada = [];
        searchContent = searchContent.toString();

        if(searchContent == ""){
            listaFiltrada = listaOriginal;
        }
        else{
            // Passa por todas as colunas procurando o conteudo informado
            columns.forEach(value => {
                for (var i = 0, iLen = listaOriginal.length; i < iLen; i++) {
                    listaOriginal.findIndex(function(obj) {
                        obj[value] = obj[value].toString();
                        if(obj[value].match(searchContent)){
                            listaFiltrada.push(obj);
                        }
                    });
                }
            });
        }
       // Repassa no array para retirar duplicatas 
        listaFiltrada = Array.from(new Set(listaFiltrada));

        return listaFiltrada;
    }
}
