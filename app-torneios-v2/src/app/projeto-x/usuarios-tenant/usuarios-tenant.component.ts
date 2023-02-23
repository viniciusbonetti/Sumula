import { Component, OnInit } from "@angular/core";
import axios from "axios";
import { post } from "jquery";
import { ControllerComponent } from "src/app/controller/controller.component";
declare var $: any;

@Component({
    selector: "app-usuarios-tenant",
    templateUrl: "./usuarios-tenant.component.html",
    styleUrls: ["./usuarios-tenant.component.css"],
})
export class UsuariosTenantComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";

    public headers = {
        Authorization: this.getToken,
        "Content-Type": "application/json",
    };
    public setToken = { headers: this.headers };

    public listaTenantUsuario: Array<{}> = [];
    public listaTenant: Array<{}> = [];
    public checkboxTenant: Array<{}> = [];
    public listaTenantUsuarioFiltrado: Array<{}> = [];

    public inputNome: string = "";
    public inputEmail: string = "";
    public inputSenha: string = "";
    public inputConfirmaSenha: string = "";

    public novoCadastro = false;
    public mostrarEditarUsuariosTenant = false;
    public editar = false;

    public num = "";
    public idUsuario = "";
    public usuariosTenant = "";
    public idRegistroUsuario = "";

    public itensPagina = 5;
    public pagAtual = 1;

    ngOnInit(): void {
        this.getTenantUsuarios();
    }

    public async getTenantUsuarios() {
        this.listaTenantUsuario = await this.getInfo(this.paths.tenantusuario, this.setToken);
        this.listaTenantUsuarioFiltrado = this.listaTenantUsuario;
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public botaoAvancar(metodo) {
        if (this.num == "") {
            this.sendNovoUsuario(metodo);
        } else if (this.num == "1") {
            this.sendTenantUsuario(metodo);
            this.num = '';
            this.novoCadastro = false;
            this.editar = false;
        }
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["id_usuario.nm_usuario", "id_tenant.nm_tenant"];

        this.listaTenantUsuarioFiltrado = this.filterTable(columns, this.listaTenantUsuario, conteudo);
        this.pagAtual = 1;
    }

    public async sendNovoUsuario(metodo) {
        const formNovoUsuario = new FormData();
        formNovoUsuario.append("nm_usuario", this.inputNome);
        formNovoUsuario.append("ds_email", this.inputEmail);
        formNovoUsuario.append("sn_usuario", this.inputSenha);
        formNovoUsuario.append("c_sn_usuario", this.inputConfirmaSenha);

        let sendInfoNovoUsuario;
        if (metodo == "post") {
            sendInfoNovoUsuario = await this.postInfo(this.paths.user, formNovoUsuario, this.setToken);

            this.idUsuario = sendInfoNovoUsuario.id;
            this.num = "1";
        } else if (metodo == "put") {
            const path = this.paths.user + `/${this.idRegistroUsuario}`;
            await this.putInfo(path, formNovoUsuario, this.setToken);
            this.getTenantRegistro();
            this.num = "1";
        }
    }

    public async getTenant() {
        this.listaTenant = await this.getInfo(this.paths.tenant, this.setToken);
    }

    public setCheckbox(id, isChecked) {

        if (isChecked.checked) {
            this.checkboxTenant.push(id);
        } else {
            let index = this.checkboxTenant.findIndex((x) => x == id);
            this.checkboxTenant.splice(index, 1);
        }
    }

    public async sendTenantUsuario(metodo) {
        const formTenantUsuario = new FormData();
        formTenantUsuario.append("id_tenant", this.checkboxTenant.toString());
        formTenantUsuario.append("st_ativo", "true");

        if (metodo == "post") {
            formTenantUsuario.append("id_usuario", this.idUsuario);
            await this.postInfo(this.paths.tenantusuario, formTenantUsuario, this.setToken);
        } else if (metodo == "put") {
            const path = this.paths.tenantusuario + `/${this.idRegistroUsuario}`;
            formTenantUsuario.append("id_usuario", this.idRegistroUsuario);
            await this.putInfo(path, formTenantUsuario, this.setToken);
        }
    }

    public async botaoMostrarEditar(item) {
        this.novoCadastro = true;
        this.editar = true;
        this.idUsuario = item.id;

        const path = this.paths.tenantusuario + `/i${item.id}&t${this.tenant}`;

        let getInfoEvento = await this.getInfo(path, this.setToken);

        this.idRegistroUsuario = getInfoEvento[0].id_usuario.id;
        this.inputNome = getInfoEvento[0].id_usuario.nm_usuario;
        this.inputEmail = getInfoEvento[0].id_usuario.ds_email;
        this.getTenant();
    }

    public async getTenantRegistro() {
        const formMostrarTenantRegistro = new FormData();
        formMostrarTenantRegistro.append("tipo_request", "tenantUser");
        formMostrarTenantRegistro.append("id_usuario", this.idRegistroUsuario);
        let listaTenantRegistro = await this.postInfo(this.paths.geral, formMostrarTenantRegistro, this.setToken);
        listaTenantRegistro.forEach((element) => {
            this.listaTenant.forEach((element2) => {
                if (element2["id"] == element.id_tenant) {
                    element2["checked"] = true;
                    this.checkboxTenant.push(element.id_tenant);
                }
            });
        });
    }

    public async excluir(item){
        this.idRegistroUsuario = item.id;

        const path = this.paths.tenantusuario + `/${this.idRegistroUsuario}`;

        await this.deleteInfo(path, this.setToken);

        this.idRegistroUsuario = "";
        this.getTenantUsuarios();
    }
}
