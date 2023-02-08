import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import axios from "axios";
declare var $: any;


@Component({
    selector: "atleta",
    templateUrl: "./atleta.component.html",
    styleUrls: ["./atleta.component.css"],
})
export class AtletaComponent implements OnInit, OnChanges {
    public getToken = localStorage.getItem("Authorization");
    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken: any = { headers: this.headers };
    public setId = localStorage.getItem("Id");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";

    public inputApelidoAtleta: string = "";
    public inputEmailAtleta: string = "";
    public inputNomeCompletoAtleta: string = "";
    public inputDataNascimentoAtleta:string = "";
    public enderecoAtleta: string = "";
    public nmrEnderecoAtleta: string = "";
    public cepAtleta: string = "";
    public estadoAtleta: string = "";
    public cidadeAtleta: string = "";

    public listaEstado = JSON.parse(localStorage.getItem('listaEstados'));
    public estadoSelect = '';

    public municipioList = [];
    public municipioSelect = '';

    public generoSelect = '';

    constructor() {}

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getMunicipio();
    }

    public async getMunicipio(){
        console.log(this.estadoSelect);
        
        let url = `${this.baseUrl}/municipio/${this.estadoSelect}`;

        let municipioAtleta = await axios.get(url, this.setToken);

        this.municipioList = municipioAtleta.data.data;
    }

    public async sendFormAtleta() {
        // let url = `${this.baseUrl}/user/${this.setId}`;
        let url = `${this.baseUrl}/atleta`;
        var formError = document.getElementsByClassName("form-error");

        for (let i = 0; i < formError.length; i++) {
            formError[i].classList.remove("text-danger");
            formError[i].innerHTML = "";
        }

        try {
            // this.generoAtleta = document.
            const formAtleta = new FormData();
            formAtleta.append('nm_atleta', this.inputNomeCompletoAtleta);
            formAtleta.append('nm_apelido', this.inputApelidoAtleta);
            formAtleta.append('tp_genero', this.generoSelect);
            formAtleta.append('dt_nascimento', this.inputDataNascimentoAtleta);
            formAtleta.append('ds_endereco', this.enderecoAtleta);
            formAtleta.append('nr_endereco', this.nmrEnderecoAtleta);
            formAtleta.append('id_municipio', this.municipioSelect);
            formAtleta.append('nr_cep', this.cepAtleta);
            // formAtleta.append('', this.estadoAtleta);
            // formAtleta.append('', this.cidadeAtleta);
            let sendAtleta = await axios.post(url, formAtleta, this.setToken);
            
            // if (this.showSenha) {
            //     const formSenha = new FormData();
            //     formSenha.append("id_usuario", this.setId);
            //     formSenha.append("tipo_request", "alterarSenha");
            //     formSenha.append("sn_usuario", this.inputSenha);
            //     formSenha.append("c_sn_usuario", this.inputConfirmaSenha);
            //     let getSenha = await axios.post(url2, formSenha, this.setToken);
            // }
            
            // const formUser = new FormData();
            // formUser.append("nm_usuario", this.inputNome);
            // formUser.append("ds_email", this.inputEmail);
            // let getInfo = await axios.put(url, formUser, this.setToken);

            this.showNotification("bottom", "center", sendAtleta.data.message, "success");
        } catch (error) {
            var erros = error.response.data.data;

            for (let i = 0; i < erros.length; i++) {
                // var input = document.getElementsByName(erros[i].campo);
                var span = document.getElementsByClassName(erros[i].campo)[0];

                span.innerHTML = erros[i].mensagem;
                span.classList.add("text-danger");

                // input[0].parentElement.classList.add("has-danger");
                // input[0].parentElement.parentElement.parentElement.parentElement.nextElementSibling.classList.add("text-danger");
                // input[0].parentElement.parentElement.parentElement.parentElement.nextElementSibling.innerHTML = erros[i].mensagem;
            }
            this.showNotification("bottom", "center", error.response.data.message, "danger");
        }
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
