import { Component, Injectable, OnInit } from "@angular/core";
import axios from "axios";
import { SweetAlertComponent } from "../components/sweetalert/sweetalert.component";
declare var $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: "/login",
        title: "Login",
        type: "page",
        icontype: ""
    },
    {
        path: "/dashboard",
        title: "Dashboard",
        type: "link",
        icontype: "dashboard",
    },
    {
        path: "/projeto-x",
        title: "ProjetoX",
        type: "sub",
        icontype: "apps",
        collapse: "projeto-x",
        children: [
            { path: "tenant", title: "Tenant", ab: "T" },
            { path: "usuarios-tenant", title: "Usuários Tenant", ab: "UT" },
            { path: "configuracoes-acessos", title: "Configurações de acessos", ab: "CA" },
        ],
    },
    {
        path: "/cco",
        title: "CCO",
        type: "sub",
        icontype: "grid_on",
        collapse: "cco",
        children: [
            { path: "cargos", title: "Cargos", ab: "C" },
            { path: "modalidades", title: "Modalidades", ab: "M" },
            { path: "eventos", title: "Eventos", ab: "E" },
            { path: "localidades", title: "Localidades", ab: "L" },
            { path: "inscricao-atleta", title: "Inscrição Atleta", ab: "IA" },
        ],
    },
    {
        path: "/tecnico",
        title: "Técnico",
        type: "sub",
        icontype: "grid_on",
        collapse: "tecnico",
        children: [
            { path: "delegacao", title: "Delegação", ab: "D" },
            { path: "atleta", title: "Atleta", ab: "A" },
        ],
    },
];
@Component({
    selector: "controller",
    templateUrl: "./controller.component.html",
    styleUrls: ["./controller.component.css"],
})
@Injectable()
export class ControllerComponent extends SweetAlertComponent implements OnInit {
    public baseUrl = "http://dornez.vps-kinghost.net/api";
    // public baseUrl = "http://187.95.144.34:8395/api";

    public tenant = localStorage.getItem("tenant");
    
    public paths = {
        login: '/login',
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
        localidades:"/localidade",
        localidadeevento:"/localidadeevento",
        equipeinscricao:"/equipeinscricao",
        geral:"/geral",
    }

    public axiosResponse:boolean = false;

    public num = "";
    public itensPagina = 14;
    public pagAtual = 1;

    ngOnInit(): void {}

    public async getInfo(path, header) {
        this.formError();
        let urlGet = this.baseUrl + path;
        try {
            let getInfo = await axios.get(urlGet, header);
            
            return getInfo;
        } catch (error) {
            return error.response;
        }

    }

    public async postInfo(path, form, header){
        this.formError();
        let urlPost = this.baseUrl + path;
        try {
            let sendInfo = await axios.post(urlPost, form, header);
            this.axiosResponse = sendInfo.data.success;
            return sendInfo.data.data;
        } catch (error) {
            this.mostrarErros(error);
            this.axiosResponse = false;
        }        
    }

    public async putInfo(path, form, header){
        this.formError();
        let urlPut = this.baseUrl + path;
        try {
            let putInfo = await axios.put(urlPut, form, header);            
            this.axiosResponse = putInfo.data.success;
            return putInfo;
        } catch (error) {
            this.mostrarErros(error);
            this.axiosResponse = false;
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
        this.showToast("bottom", error.response.data.message, "error");
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
     * @params column        (string)  -> coluna desejada para ordenar
     * @params listaOriginal (array)   -> lista com os dados para ser ordenado
     * @params order         (string)  -> ordem a ser utilizada (ASC/DESC)
     * @params event         (array)   -> dados do elemento
     * @params convert       (boolean) -> converte dados especificos
     */
    public sortTable(column, listaOriginal, order, event, convert?){
        // Passa por todos os elementos de setas, para limpar as classes e colocar a classe de ativo apenas no elemento clicado
        if(event != ""){
            let sortIcon = document.getElementsByClassName('sort-icon');
            [].forEach.call(sortIcon, function(el) {
                el.classList.remove('si-active');
            });
            event.srcElement.classList.add('si-active');
        }

        if(convert){
            if(column == "tp_contato"){
                listaOriginal = this.convertList("tp_contato", listaOriginal);
            }
            else if(column == "tp_documento"){
                listaOriginal = this.convertList("tp_documento", listaOriginal);
            }
        }

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

    /** Função para limpar string
     * @params string   (string) -> texto para limpar
     * return newString (string) -> texto formatado
    */
    public limpaString(string){
        let newString = string.replace(/[,.-]/g, '');
        return newString;
    }

    /** Função para converter siglas em texto
     * @params column        (string) -> coluna desejada para converter
     * @params listaOriginal (array)  -> lista com os dados para conversão
    */
    public convertList(column, listaOriginal){
        switch (column) {
            case 'tp_contato':
                listaOriginal.forEach(lista => {
                    switch (lista[column]) {
                        case 'FF':
                            lista[column] = 'TELEFONE FIXO';
                        break;
                        case 'FC':
                            lista[column] = 'TELEFONE CELULAR';
                        break;
                        case 'EM':
                            lista[column] = 'E-MAIL';
                        break;
                        case 'FB':
                            lista[column] = 'FACEBOOK';
                        break;
                        case 'IN':
                            lista[column] = 'INSTAGRAM';
                        break;
                        case 'OT':
                            lista[column] = 'OUTRO';
                        break;
                    }
                });
            break;
            case 'tp_documento':
                listaOriginal.forEach(lista => {
                    switch (lista[column]) {
                        case 'H':
                            lista[column] = 'CARTEIRA DE HABILITAÇÃO';
                        break;
                        case 'T':
                            lista[column] = 'CARTEIRA DE TRABALHO';
                        break;
                        case 'C':
                            lista[column] = 'CPF';
                        break;
                        case 'M':
                            lista[column] = 'IDENTIDADE MILITAR';
                        break;
                        case 'P':
                            lista[column] = 'PASSAPORTE';
                        break;
                        case 'E':
                            lista[column] = 'REGISTRO NACIONAL DE ESTRANGEIRO';
                        break;
                        case 'R':
                            lista[column] = 'RG';
                        break;
                        case 'O':
                            lista[column] = 'OUTRO';
                        break;
                    }
                });
            break;
        }

        return listaOriginal;
    }
}