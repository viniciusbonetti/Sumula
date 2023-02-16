import { Component, OnInit } from '@angular/core';
import axios from 'axios';
declare var $: any;

@Component({
  selector: 'app-usuarios-tenant',
  templateUrl: './usuarios-tenant.component.html',
  styleUrls: ['./usuarios-tenant.component.css']
})
export class UsuariosTenantComponent implements OnInit {
  public getToken = localStorage.getItem("Authorization");
  public tenant = localStorage.getItem("tenant");
  public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";

  public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
  public setToken = { headers: this.headers };

  public listaTenantUsuario: Array<{}> = [];
  public listaTenant: Array<{}> = [];
  public checkboxTenant: Array<{}> = [];

  public inputNome: string = "";
  public inputEmail: string = "";
  public inputSenha: string = "";
  public inputConfirmaSenha: string = "";

  public novoCadastro = false;

  public num = "";
  public idUsuario = "";

  constructor() {}

  ngOnInit(): void {
      this.getTenantUsuarios();
  }

  public async getTenantUsuarios() {
      const urlGetTenantUsuarios = `${this.baseUrl}/tenantusuario`;

      let getInfoTenantUsuarios = await axios.get(urlGetTenantUsuarios, this.setToken);

      this.listaTenantUsuario = getInfoTenantUsuarios.data.data;
  }

  public cadastrar() {
      this.novoCadastro = !this.novoCadastro;
  }

  public botaoAvancar() {
      if (this.num == "") {
          this.sendNovoUsuario();
      } else if (this.num == "1") {
          this.sendTenantUsuario();
      }
  }

  public async sendNovoUsuario() {
      const urlSendNovoUsuario = `${this.baseUrl}/user`;

      this.formError();

      try {
          const formNovoUsuario = new FormData();
          formNovoUsuario.append("nm_usuario", this.inputNome);
          formNovoUsuario.append("ds_email", this.inputEmail);
          formNovoUsuario.append("sn_usuario", this.inputSenha);
          formNovoUsuario.append("c_sn_usuario", this.inputConfirmaSenha);

          let sendInfoNovoUsuario = await axios.post(urlSendNovoUsuario, formNovoUsuario, this.setToken);

          this.idUsuario = sendInfoNovoUsuario.data.data.id;

          this.num = "1";

          this.getTenant();
      } catch (error) {
          this.mostrarErros(error);
      }
  }

  public async getTenant() {
      const urlGetTenant = `${this.baseUrl}/tenant`;

      let getInfoTenant = await axios.get(urlGetTenant, this.setToken);

      this.listaTenant = getInfoTenant.data.data;
      console.log(this.listaTenant);
  }

  public setCheckbox(id, isChecked) {
      if (isChecked.checked) {
          this.checkboxTenant.push(id);
          console.log(this.checkboxTenant.toString());
      } else {
          let index = this.checkboxTenant.findIndex((x) => x == id);
          this.checkboxTenant.splice(index, 1);
      }
  }

  public async sendTenantUsuario() {
      const urlSendTenantUsuario = `${this.baseUrl}/tenantusuario`;

      this.formError();

      try {
          const formTenantUsuario = new FormData();
          formTenantUsuario.append("id_usuario", this.idUsuario);
          formTenantUsuario.append("id_tenant", this.checkboxTenant.toString());
          formTenantUsuario.append("st_ativo", "true");

          let sendInfoTenantUsuario = await axios.post(urlSendTenantUsuario, formTenantUsuario, this.setToken);
      } catch (error) {
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
