import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import axios from "axios";
declare var $: any;

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken: any = { headers: this.headers };
    public setId = localStorage.getItem("Id");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";

    public inputNome: string = "";
    public inputEmail: string = "";
    public inputSenha: string = "";
    public inputConfirmaSenha: string = "";
    public usuario = [];

    public showSenha = false;

    ngOnInit() {
        this.getUsuarios();
    }

    public async getUsuarios() {
        const url = `${this.baseUrl}/user/${this.setId}`;

        let getInfo = await axios.get(url, this.setToken);

        this.inputNome = getInfo.data.data.nm_usuario;
        this.inputEmail = getInfo.data.data.ds_email;
    }

    //sendform('user/id', 'formsenha', 'post', 'showsenha');

    public async sendForm() {
        let url = `${this.baseUrl}/user/${this.setId}`;
        let url2 = `${this.baseUrl}/geral/`;
        var formError = document.getElementsByClassName("form-error");

        for (let i = 0; i < formError.length; i++) {
            formError[i].classList.remove("text-danger");
            formError[i].innerHTML = "";
        }

        try {
            if (this.showSenha) {
                const formSenha = new FormData();
                formSenha.append("id_usuario", this.setId);
                formSenha.append("tipo_request", "alterarSenha");
                formSenha.append("sn_usuario", this.inputSenha);
                formSenha.append("c_sn_usuario", this.inputConfirmaSenha);
                let getSenha = await axios.post(url2, formSenha, this.setToken);
            }

            const formUser = new FormData();
            formUser.append("nm_usuario", this.inputNome);
            formUser.append("ds_email", this.inputEmail);
            let getInfo = await axios.put(url, formUser, this.setToken);

            this.showNotification("bottom", "center", getInfo.data.message, "success");
        } catch (error) {
            var erros = error.response.data.data;

            for (let i = 0; i < erros.length; i++) {
                var input = document.getElementsByName(erros[i].campo);

                input[0].parentElement.classList.add("has-danger");
                input[0].parentElement.parentElement.parentElement.parentElement.nextElementSibling.classList.add("text-danger");
                input[0].parentElement.parentElement.parentElement.parentElement.nextElementSibling.innerHTML = erros[i].mensagem;
            }
            this.showNotification("bottom", "center", error.response.data.message, "danger");
        }
    }

    public mostrarSenha() {
        this.showSenha = true;
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
