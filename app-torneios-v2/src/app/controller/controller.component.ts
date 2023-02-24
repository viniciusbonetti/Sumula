import { Component, Injectable, OnInit } from "@angular/core";
import axios from "axios";
import { SweetAlertComponent } from "../components/sweetalert/sweetalert.component";
declare var $: any;

@Component({
    selector: "controller",
    templateUrl: "./controller.component.html",
    styleUrls: ["./controller.component.css"],
})
@Injectable()
export class ControllerComponent extends SweetAlertComponent implements OnInit {
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
        geral:"/geral"
    }

    public num = "";
    public itensPagina = 5;
    public pagAtual = 1;

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

    /** Função para filtrar conteúdo da tabela
     * @params columns       (array)  -> colunas onde deverá ser buscado
     * @params listaOriginal (array)  -> lista com os dados para ser buscado
     * @params searchContent (string) -> conteúdo que deverá ser buscado
     */
    public filterTable(columns, listaOriginal, searchContent){
        let listaFiltrada = [];
        searchContent = searchContent.toString();
        let regex = new RegExp(searchContent, "i");

        if(searchContent == ""){
            listaFiltrada = listaOriginal;
        }
        else{
            // Passa por todas as colunas procurando o conteudo informado
            columns.forEach(value => {
                // Quando o array é multidimensional, faz o tratamento para pegar os indexes
                if(value.includes('.')){
                    let columnSplit = value.split('.');
                    for (var i = 0, iLen = listaOriginal.length; i < iLen; i++) {
                        let objColumn = "";
                        listaOriginal.findIndex(function(obj) {
                            if(columnSplit.length <= 2){
                                objColumn = obj[columnSplit[0]][columnSplit[1]];
                            }
                            else if(columnSplit.length > 2){
                                objColumn = obj[columnSplit[0]][columnSplit[1]][columnSplit[2]];
                            }
                            if(objColumn != null){
                                objColumn = objColumn.toString();
                                if(objColumn.match(regex)){
                                    listaFiltrada.push(obj);
                                }
                            }
                        });
                    }
                }
                else{
                    for (var i = 0, iLen = listaOriginal.length; i < iLen; i++) {
                        listaOriginal.findIndex(function(obj) {
                            if(obj[value] != null){
                                obj[value] = obj[value].toString();
                                if(obj[value].match(regex)){
                                    listaFiltrada.push(obj);
                                }
                            }
                        });
                    }
                }
            });
        }
       // Repassa no array para retirar duplicatas 
        listaFiltrada = Array.from(new Set(listaFiltrada));

        return listaFiltrada;
    }

    /** Função para ordenar a tabela
     * @params column        (string) -> coluna desejada para ordenar
     * @params listaOriginal (array)  -> lista com os dados para ser ordenado
     * @params order         (string) -> ordem a ser utilizada (ASC/DESC)
     * @params event         (array)  -> dados do elemento
     */
    public sortTable(column, listaOriginal, order, event){
        // Passa por todos os elementos de setas, para limpar as classes e colocar a classe de ativo apenas no elemento clicado
        let sortIcon = document.getElementsByClassName('sort-icon');
        [].forEach.call(sortIcon, function(el) {
            el.classList.remove('si-active');
        });
        event.srcElement.classList.add('si-active');

        let listaFiltrada = [];
        if(order === "ASC"){
            listaFiltrada = listaOriginal.sort(function(a, b) {
                if(column.includes('.')){
                    let columnSplit = column.split('.');
                    let objColumnA = "";
                    let objColumnB = "";
                    if(columnSplit.length <= 2){
                        objColumnA = a[columnSplit[0]][columnSplit[1]];
                        objColumnB = b[columnSplit[0]][columnSplit[1]];
                    }
                    else if(columnSplit.length > 2){
                        objColumnA = a[columnSplit[0]][columnSplit[1]][columnSplit[2]];
                        objColumnB = b[columnSplit[0]][columnSplit[1]][columnSplit[2]];
                    }
                    return objColumnA.localeCompare(objColumnB);
                }
                else{
                    if(a['id']){
                        return a[column].localeCompare(b[column], 'en', {numeric: true});
                    }
                    else{
                        return a[column].localeCompare(b[column]);
                    }
                }
            });
        }
        else if(order === "DESC"){
            listaFiltrada = listaOriginal.sort(function(a, b) {
                if(column.includes('.')){
                    let columnSplit = column.split('.');
                    let objColumnA = "";
                    let objColumnB = "";
                    if(columnSplit.length <= 2){
                        objColumnA = a[columnSplit[0]][columnSplit[1]];
                        objColumnB = b[columnSplit[0]][columnSplit[1]];
                    }
                    else if(columnSplit.length > 2){
                        objColumnA = a[columnSplit[0]][columnSplit[1]][columnSplit[2]];
                        objColumnB = b[columnSplit[0]][columnSplit[1]][columnSplit[2]];
                    }
                    return objColumnB.localeCompare(objColumnA);
                }
                else{
                    if(b['id']){
                        return b[column].localeCompare(a[column], 'en', {numeric: true});
                    }
                    else{
                        return b[column].localeCompare(a[column]);
                    }
                }
            });
        }
        return listaFiltrada;
    }
}