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

    public headers = {
        Authorization: this.getToken,
        "Content-Type": "application/json",
    };
    public setToken = { headers: this.headers };

    public listaTenantUsuario: Array<{}> = [];
    public listaTenant: Array<{}> = [];
    public checkboxTenant: Array<{}> = [];
    public listaTenantUsuarioFiltrado: Array<{}> = [];
    public listaPerfis: Array<{}> = [];
    public listaPerfisAtivos: Array<{}> = [];
    public checkboxPerfis: Array<{}> = [];

    public inputNome: string = "";
    public inputEmail: string = "";
    public inputSenha: string = "";
    public inputConfirmaSenha: string = "";

    public novoCadastro = false;
    public mostrarEditarUsuariosTenant = false;
    public editar = false;
    public ativarTabs = false;

    public num = "";
    public idUsuario = "";
    public usuariosTenant = "";
    public idRegistroUsuario = "";

    ngOnInit(): void {
        this.getTenantUsuarios();
    }

    public async getTenantUsuarios() {
        let resposta = await this.getInfo(this.paths.tenantusuario, this.setToken);
        if (resposta.status == 200) {
            this.listaTenantUsuario = resposta.data.data;
            this.listaTenantUsuarioFiltrado = this.listaTenantUsuario;
        }
    }

    public cadastrar() {
        this.novoCadastro = true;
        this.editar = false;
        this.getTenant();
    }

    public tabs(index) {
        this.num = index;
    }

    public botaoSend(tab) {
        if (tab == "perfis") {
            this.sendPerfilUsuario();
        }
    }

    public toHome() {
        this.idRegistroUsuario = "";
        this.novoCadastro = false;
        this.editar = false;
        this.limparForm();
    }

    public botaoAvancar(metodo) {
        let tabHeaders = document.getElementsByClassName("tabHeader");
        let tabPanes = document.getElementsByClassName("tab-pane");
        let nextIndex: number = 0;
        let tabIndex: number = 0;
        let tabPaneAtual = "";
        let tabPaneNext = "";

        Array.from(tabPanes).forEach(function (tab, index) {
            if (tab.classList.contains("active")) {
                tabIndex = index;
                nextIndex = index + 1;
            }
        });

        if (nextIndex < tabPanes.length) {
            tabPaneAtual = tabHeaders[tabIndex].getAttribute("href").replace("#", "");
            tabPaneNext = tabHeaders[nextIndex].getAttribute("href").replace("#", "");
            // Remove os ativos do elemento atual
            tabHeaders[tabIndex].setAttribute("aria-selected", "false");
            tabHeaders[tabIndex].classList.remove("active");
            document.getElementById(tabPaneAtual).classList.remove("active");
            // Adiciona os ativos no elemento proximo
            tabHeaders[nextIndex].setAttribute("aria-selected", "true");
            tabHeaders[nextIndex].classList.add("active");
            document.getElementById(tabPaneNext).classList.add("active");
        }

        if (this.num == "") {
            this.sendNovoUsuario(metodo);
        } else if (this.num == "1") {
            if (this.checkboxTenant.length > 0) {
                this.sendTenantUsuario(metodo);
                this.num = "";
                this.novoCadastro = false;
                this.editar = false;
                this.limparForm();
            } else {
                this.sendTenantUsuario(metodo);
            }
        }
    }

    public botaoVoltar() {
        let tabHeaders = document.getElementsByClassName("tabHeader");
        let tabPanes = document.getElementsByClassName("tab-pane");
        let prevIndex: number = 0;
        let tabIndex: number = 0;
        let tabPaneAtual = "";
        let tabPanePrev = "";

        Array.from(tabPanes).forEach(function (tab, index) {
            if (tab.classList.contains("active")) {
                tabIndex = index;
                prevIndex = index - 1;
            }
        });

        if (prevIndex >= 0) {
            tabPaneAtual = tabHeaders[tabIndex].getAttribute("href").replace("#", "");
            tabPanePrev = tabHeaders[prevIndex].getAttribute("href").replace("#", "");
            // Remove os ativos do elemento atual
            tabHeaders[tabIndex].setAttribute("aria-selected", "false");
            tabHeaders[tabIndex].classList.remove("active");
            document.getElementById(tabPaneAtual).classList.remove("active");
            // Adiciona os ativos no elemento proximo
            tabHeaders[prevIndex].setAttribute("aria-selected", "true");
            tabHeaders[prevIndex].classList.add("active");
            document.getElementById(tabPanePrev).classList.add("active");
        }

        if (this.num == "") {
            this.idRegistroUsuario = "";
            this.novoCadastro = false;
            this.editar = false;
            this.limparForm();
        } else if (this.num == "1") {
            this.editar = true;
            this.num = "";
            if (this.checkboxTenant.length > 0) {
                this.sendTenantUsuario("put");
            }
        }
    }

    public async getEdits() {
        await this.getTenant();
        await this.getTenantRegistro();
        await this.getListaPerfil();
        await this.getPerfilRegistro();
    }

    public limparForm() {
        this.inputNome = "";
        this.inputEmail = "";
        this.inputSenha = "";
        this.inputConfirmaSenha = "";
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["id", "id_usuario.nm_usuario", "id_tenant.nm_tenant"];

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
            // this.num = "1";
            this.showToast("bottom", "Registro de Usuário criado com sucesso!", "success");
        } else if (metodo == "put") {
            const path = this.paths.user + `/${this.idUsuario}`;
            await this.putInfo(path, formNovoUsuario, this.setToken);
            this.getTenantRegistro();
            // this.num = "1";
            this.showToast("bottom", "Registro de Usuário atualizado com sucesso!", "success");
        }

        if (this.axiosResponse == true) {
            this.ativarTabs = true;
            this.num = "1";
        }

        this.getTenantUsuarios();
    }

    public async getTenant() {
        let resposta = await this.getInfo(this.paths.tenant, this.setToken);
        if (resposta.status == 200) {
            this.listaTenant = resposta.data.data;
        }
    }

    public setCheckbox(id, isChecked, tab) {
        if (tab == "tenant") {
            if (isChecked.checked) {
                this.checkboxTenant.push(id);
            } else {
                let index = this.checkboxTenant.findIndex((x) => x == id);
                this.checkboxTenant.splice(index, 1);
            }
        } else if (tab == "perfis") {
            if (isChecked.checked) {
                this.checkboxPerfis.push(id);
            } else {
                let index = this.checkboxPerfis.findIndex((x) => x == id);
                this.checkboxPerfis.splice(index, 1);
            }
        }
    }

    public async sendTenantUsuario(metodo) {
        const formTenantUsuario = new FormData();
        formTenantUsuario.append("id_tenant", this.checkboxTenant.toString());
        formTenantUsuario.append("st_ativo", "true");

        if (metodo == "post") {
            formTenantUsuario.append("id_usuario", this.idUsuario);
            await this.postInfo(this.paths.tenantusuario, formTenantUsuario, this.setToken);
            this.showToast("bottom", "Acessos de Tenant criados com sucesso!", "success");
        } else if (metodo == "put") {
            const path = this.paths.tenantusuario + `/${this.idUsuario}`;
            formTenantUsuario.append("id_usuario", this.idUsuario);
            await this.putInfo(path, formTenantUsuario, this.setToken);
            this.showToast("bottom", "Acessos de Tenant atualizados com sucesso!", "success");
        }
        this.getTenantUsuarios();
        this.checkboxTenant = [];
    }

    public async botaoMostrarEditar(item) {
        this.novoCadastro = true;
        this.editar = true;
        this.ativarTabs = true;
        this.idUsuario = item.id;

        this.idUsuario = item.id_usuario.id;
        this.inputNome = item.id_usuario.nm_usuario;
        this.inputEmail = item.id_usuario.ds_email;
        this.getEdits();
    }

    public async getTenantRegistro() {
        const formMostrarTenantRegistro = new FormData();
        formMostrarTenantRegistro.append("tipo_request", "tenantUser");
        formMostrarTenantRegistro.append("id_usuario", this.idUsuario);
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

    public async getListaPerfil() {
        this.listaPerfisAtivos = [];
        let resposta = await this.getInfo(this.paths.perfil, this.setToken);
        this.listaPerfis = resposta.data.data;
        this.listaPerfis.forEach((itemListaPerfis) => {
            if (itemListaPerfis["st_ativo"] == true) {
                itemListaPerfis["checked"] = false;
                this.listaPerfisAtivos.push(itemListaPerfis);
            }
        });
    }

    public async getPerfilRegistro() {
        const formGetPerfisRegistro = new FormData();
        formGetPerfisRegistro.append("tipo_request", "getPerfil");
        formGetPerfisRegistro.append("id_usuario", this.idUsuario);

        let listaPerfisRegistro = await this.postInfo(this.paths.geral, formGetPerfisRegistro, this.setToken);

        listaPerfisRegistro.forEach((element) => {
            this.listaPerfisAtivos.forEach((element2) => {
                if (element2["id"] == element) {
                    element2["checked"] = true;
                    this.checkboxPerfis.push(element);
                }
            });
        });
    }

    public async sendPerfilUsuario() {
        const formPerfilUsuario = new FormData();
        formPerfilUsuario.append("tipo_request", "perfilUser");
        formPerfilUsuario.append("id_usuario", this.idUsuario);
        formPerfilUsuario.append("id_perfil", this.checkboxPerfis.toString());

        await this.postInfo(this.paths.geral, formPerfilUsuario, this.setToken);
        this.showToast("bottom", "Acessos de Perfis criados com sucesso!", "success");

        this.getTenantUsuarios();
        this.checkboxPerfis = [];
    }

    public async excluir(item) {
        const type = "warning-message-and-cancel";
        this.mensagemTitulo = "Deseja deletar o usuário?";
        this.mensagemAlerta = "Esta ação não será reversível e irá deletar todos os registros relacionados ao usuário!";
        await this.showSwal(type);
        if (this.resultado) {
            this.idUsuario = item.id;

            const path = this.paths.tenantusuario + `/${this.idUsuario}`;

            await this.deleteInfo(path, this.setToken);

            this.idUsuario = "";
            this.getTenantUsuarios();
        }
    }
}
