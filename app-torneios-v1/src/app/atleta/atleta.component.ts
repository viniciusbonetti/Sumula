import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import axios from "axios";
import { url } from "inspector";
declare var $: any;

@Component({
    selector: "atleta",
    templateUrl: "./atleta.component.html",
    styleUrls: ["./atleta.component.css"],
})
export class AtletaComponent implements OnInit, OnChanges {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken: any = { headers: this.headers };
    public headers2 = { Authorization: this.getToken };
    public setToken2: any = { headers: this.headers2 };

    public inputApelidoAtleta: string = "";
    public inputEmailAtleta: string = "";
    public inputNomeCompletoAtleta: string = "";
    public inputDataNascimentoAtleta: string = "";
    public inputEnderecoAtleta: string = "";
    public inputNmrEnderecoAtleta: string = "";
    public inputCepAtleta: string = "";
    public inputNumeroDocumentoAtleta: string = "";
    public inputContatoAtleta: string = "";

    public listaEstado: Array<{}> = JSON.parse(localStorage.getItem("listaEstados"));
    public listaMunicipio: Array<{}> = [];
    public listaModalidades: Array<{}> = [];
    public checkboxAtleta: Array<{}> = [];
    public listaDocumentoAtleta: Array<{}> = [];
    public listaContatoAtleta: Array<{}> = [];

    public estadoSelect = "";
    public municipioSelect = "";
    public generoSelect = "";
    public modalidadeSelect = "";
    public documentoAtletaSelect = "";
    public contatoSelect = "";

    public num = "";
    public idAtleta: string = "";
    public documentoAtletaImg = "";

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        this.getMunicipio();
    }

    public async getMunicipio() {
        console.log(this.estadoSelect);

        let url = `${this.baseUrl}/municipio/${this.estadoSelect}`;

        let municipioAtleta = await axios.get(url, this.setToken);

        this.listaMunicipio = municipioAtleta.data.data;
    }

    public async sendFormAtleta() {
        let url = `${this.baseUrl}/atleta`;
        this.formError();

        try {
            const formAtleta = new FormData();
            formAtleta.append("nm_atleta", this.inputNomeCompletoAtleta);
            formAtleta.append("nm_apelido", this.inputApelidoAtleta);
            formAtleta.append("tp_genero", this.generoSelect);
            formAtleta.append("dt_nascimento", this.inputDataNascimentoAtleta);
            formAtleta.append("ds_endereco", this.inputEnderecoAtleta);
            formAtleta.append("nr_endereco", this.inputNmrEnderecoAtleta);
            formAtleta.append("id_municipio", this.municipioSelect);
            formAtleta.append("nr_cep", this.inputCepAtleta);
            let sendAtleta = await axios.post(url, formAtleta, this.setToken);

            this.idAtleta = sendAtleta.data.data.id;

            this.showNotification("bottom", "center", sendAtleta.data.message, "success");
            this.getModalidades();

            this.num = "1";
        } catch (error) {
            this.mostrarErros(error);
        }
    }

    public cancelarCadastro() {
        this.inputApelidoAtleta = "";
        this.inputEmailAtleta = "";
        this.inputNomeCompletoAtleta = "";
        this.inputDataNascimentoAtleta = "";
        this.inputEnderecoAtleta = "";
        this.inputNmrEnderecoAtleta = "";
        this.inputCepAtleta = "";
    }

    public botaoAvancar() {
        if (this.num == "") {
            this.sendFormAtleta();
        } else if (this.num == "1") {
            if(this.checkboxAtleta.length > 0){
                this.num = '2';
            }else {
                this.sendModalidadesAtleta();
            }
        }else if(this.num == "2"){
            if(this.listaDocumentoAtleta.length > 0){
                this.num = '3';
            }else{
                this.sendDocumentoAtleta();
            }
        }
    }

    public async getModalidades() {
        const urlGetModalidades = `${this.baseUrl}/modalidade`;

        let getInfoModalidade = await axios.get(urlGetModalidades, this.setToken);

        this.listaModalidades = getInfoModalidade.data.data;
    }

    public setCheckbox(id, isChecked) {
        if (isChecked.checked) {
            this.checkboxAtleta.push(id);
            console.log(this.checkboxAtleta.toString());
        } else {
            let index = this.checkboxAtleta.findIndex((x) => x == id);
            this.checkboxAtleta.splice(index, 1);
        }
    }

    public async sendModalidadesAtleta() {
        const urlSendModalidadeAtleta = `${this.baseUrl}/modalidadeatleta`;
        this.formError();

        try {
            const formModalidadeAtleta = new FormData();
            formModalidadeAtleta.append("id_modalidade", this.checkboxAtleta.toString());
            formModalidadeAtleta.append("id_atleta", this.idAtleta);
            formModalidadeAtleta.append("st_ativo", "true");

            let sendinfoModalidadesAtleta = await axios.post(urlSendModalidadeAtleta, formModalidadeAtleta, this.setToken);

            this.num = "2";
        } catch (error) {
            this.mostrarErros(error);
        }
    }

    public adicionarFotoDocumento(event) {
        const file = event.target.files[0];
        this.documentoAtletaImg = file;
    }

    public async sendDocumentoAtleta() {
        const urlSendDocumentoAtleta = `${this.baseUrl}/documentoatleta`;
        this.formError();

        try {
            const formDocumentoAtleta = new FormData();
            formDocumentoAtleta.append("id_atleta", this.idAtleta);
            formDocumentoAtleta.append("tp_documento", this.documentoAtletaSelect);
            formDocumentoAtleta.append("nr_documento", this.inputNumeroDocumentoAtleta);
            formDocumentoAtleta.append("ds_midia", this.documentoAtletaImg);

            let sendInfoDocumentoAtleta = await axios.post(urlSendDocumentoAtleta, formDocumentoAtleta, this.setToken2);
            this.limparFormDocumentoAtleta();
            this.getDocumentoAtleta();
        } catch (error) {
            this.mostrarErros(error);
        }
    }

    public async getDocumentoAtleta() {
        const urlGetDocumentoAtleta = `${this.baseUrl}/documentoatleta/t${this.idAtleta}`;

        let getInfoDocumentoAtleta = await axios.get(urlGetDocumentoAtleta, this.setToken);

        this.listaDocumentoAtleta = getInfoDocumentoAtleta.data.data;
        console.log(this.listaDocumentoAtleta);
        
    }

    public limparFormDocumentoAtleta() {
        this.documentoAtletaSelect = "";
        this.inputNumeroDocumentoAtleta = "";
        this.documentoAtletaImg = "";
    }

    public async sendContatoAtleta() {
        const urlSendContatoAtleta = `${this.baseUrl}/contatoatleta`;
        this.formError();

        try {
            const formContatoAtleta = new FormData();
            formContatoAtleta.append("id_atleta", this.idAtleta);
            formContatoAtleta.append("tp_contato", this.contatoSelect);
            formContatoAtleta.append("ds_contato", this.inputContatoAtleta);

            let sendInfoContatoAtleta = await axios.post(urlSendContatoAtleta, formContatoAtleta, this.setToken);
            
            this.limparFormContatoAtleta();
            this.getContatoAtleta();
        } catch (error) {
            this.mostrarErros(error);
        }
    }

    public async getContatoAtleta(){
        const urlGetContatoAtleta = `${this.baseUrl}/contatoatleta/t${this.idAtleta}`

        let getInfoContatoAtleta = await axios.get(urlGetContatoAtleta, this.setToken);

        this.listaContatoAtleta = getInfoContatoAtleta.data.data
    }

    public limparFormContatoAtleta() {
        this.contatoSelect = "";
        this.inputContatoAtleta = "";
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
