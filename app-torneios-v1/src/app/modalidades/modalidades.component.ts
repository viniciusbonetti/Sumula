import { Component, OnInit } from "@angular/core";
import axios from "axios";
declare var $: any;

@Component({
    selector: "modalidades",
    templateUrl: "./modalidades.component.html",
    styleUrls: ["./modalidades.component.css"],
})
export class ModalidadesComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public url = `${this.baseUrl}/modalidade`;

    public headers = { Authorization:  this.getToken, "Content-Type": "application/json"}
    public setToken = {headers: this.headers}

    public novoCadastro = false;
    public mostrarEditarModalidade = false;

    public listaModalidades: Array<{ id: string; nm_modalidade:string, tp_modalidade:string}> = [];
    public inputNomeModalidade: string = '';
    public inputTipoModalidade: string = '';
    public idModalidade = '';

    constructor() {}

    ngOnInit(): void {
        this.getModalidades();
    }

    public cadastrar(){
        this.novoCadastro = !this.novoCadastro;
    }

    public async getModalidades(){
        let getInfo = await axios.get(this.url, this.setToken);

        this.listaModalidades = getInfo.data.data;
    }

    public async sendModalidade(){
        this.formError();

        try{
            const formModalidade = new FormData();
        formModalidade.append('nm_modalidade', this.inputNomeModalidade.toUpperCase());
        formModalidade.append('tp_modalidade', this.inputTipoModalidade.toUpperCase());

        let sendInfo = await axios.post(this.url, formModalidade, this.setToken);

        this.inputNomeModalidade = '';
        this.inputTipoModalidade = '';
        
        this.cancelarCadastro();
        this.getModalidades();
        }catch (error){
            this.mostrarErros(error);
        }
        
    }

    public cancelarCadastro(){
        this.inputNomeModalidade = '';
        this.inputTipoModalidade = '';
    }

    public mostrarEdicaoModalidade(item){
        item.mostrarEditarModalidade = true
    }

    public async editarModalidade(item){
        try {
            this.idModalidade = item.id;
            
            let urlPut = `${this.baseUrl}/modalidade/${this.idModalidade}`;

            const formEditarModalidade = new FormData();
            formEditarModalidade.append('nm_modalidade', item.nm_modalidade.toUpperCase());
            formEditarModalidade.append('tp_modalidade', item.tp_modalidade.toUpperCase());
            
            let putInfo = await axios.put(urlPut, formEditarModalidade, this.setToken);

            this.getModalidades();
        }
        catch (error) {
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
