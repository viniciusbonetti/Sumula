import { Component, Input, OnInit, Output } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";
declare var $: any;

@Component({
    selector: "app-tenant",
    templateUrl: "./tenant.component.html",
    styleUrls: ["./tenant.component.scss"],
})
export class TenantComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    // public headers = { Authorization: this.getToken };
    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken: any = { headers: this.headers };

    public listaEmpresas: Array<string> = [];
    public listaEmpresasFiltrada: Array<string> = [];

    public novoCadastro: boolean = false;
    public mostrarEditar: boolean = false;
    public novaEmpresaNome: string = "";
    public idRegistroTenant: string = "";
    public novaEmpresaImg: any = "";
    public inputFileTenant = "";
    public editarInputFileTenant = "";
    public image = "";
    public extension = "";

    public listaEstados = {};
    public pathTenant = `/tenant`;

    ngOnInit() {
        this.getListaEmpresas();
        this.getEstado();
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["id", "nm_tenant"];

        this.listaEmpresasFiltrada = this.filterTable(columns, this.listaEmpresas, conteudo);
        this.pagAtual = 1;
    }

    public async getListaEmpresas() {
        const path = this.pathTenant;

        let resposta = await this.getInfo(path, this.setToken);
        if(resposta.status == 200){
            this.listaEmpresas = resposta.data.data;
            // Repassa no array para transformar tudo em letra maiuscula
            this.listaEmpresas.forEach((lista) => {
                lista["nm_tenant"] = lista["nm_tenant"].toUpperCase();
            });
            this.listaEmpresasFiltrada = this.listaEmpresas;
        }
    }

    public async adicionarEmpresa() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async confirmarNovoTenant() {
        const formData = new FormData();
        formData.append("image", this.image);
        formData.append("extension", this.extension);
        formData.append("nm_tenant", this.novaEmpresaNome);

        await this.postInfo(this.pathTenant, formData, this.setToken);

        this.getListaEmpresas();
        this.limparCadastroTenant();
        this.showToast("bottom", "Registro de Tenant criado com sucesso!", "success");
    }

    public limparCadastroTenant() {
        this.novaEmpresaImg = "";
        this.inputFileTenant = "";
        this.novaEmpresaNome = "";
    }

    public async getEstado() {
        let listaEstados = await this.getInfo(this.paths.estado, this.setToken);
        this.listaEstados = listaEstados.data.data;
        localStorage.setItem("listaEstados", JSON.stringify(this.listaEstados));
    }

    public botaoMostrarEditar(item, lista) {
        lista.forEach((element) => {
            element.mostrarEditar = false;
        });
        item.mostrarEditar = true;
    }

    public async editar(item) {
        this.idRegistroTenant = item.id;
        const path = this.pathTenant + `/${this.idRegistroTenant}`;

        const formEditarTenant = new FormData();
        formEditarTenant.append("image", this.image);
        formEditarTenant.append("extension", this.extension);
        formEditarTenant.append("nm_tenant", item.nm_tenant);

        let putInfo = await this.putInfo(path, formEditarTenant, this.setToken);

        if (putInfo.data.success) {
            item.mostrarEditar = false;
            this.idRegistroTenant = "";
        }

        this.extension = "";
        this.image = "";
        this.getListaEmpresas();
        this.showToast("bottom", "Registro de Tenant atualizado com sucesso!", "success");
    }

    public imagemTenant(event) {
        let file = event.target.files[0];
        this.extension = file.type.split("/")[1];

        if (file) {
            var reader = new FileReader();

            reader.onload = this._handleReaderLoaded.bind(this);

            reader.readAsBinaryString(file);
        }
    }

    public _handleReaderLoaded(readerEvt) {
        var binaryString = readerEvt.target.result;
        this.image = btoa(binaryString);
    }

    public async excluir(item) {
        const type = "warning-message-and-cancel";
        this.mensagemTitulo = "Deseja deletar o Tenant?";
        this.mensagemAlerta = "Esta ação não será reversível e irá deletar todos os registros relacionados ao Tenant!";
        await this.showSwal(type);
        if (this.resultado) {
            this.idRegistroTenant = item.id;

            const path = this.paths.tenant + `/${this.idRegistroTenant}`;

            await this.deleteInfo(path, this.setToken);

            this.idRegistroTenant = "";
            this.getListaEmpresas();
        }
    }

    public cancelarEdicao(item) {
        item.mostrarEditar = false;
    }
}
