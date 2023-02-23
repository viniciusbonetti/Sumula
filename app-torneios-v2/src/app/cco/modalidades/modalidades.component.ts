import { Component, OnInit } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";

@Component({
    selector: "app-modalidades",
    templateUrl: "./modalidades.component.html",
    styleUrls: ["./modalidades.component.css"],
})
export class ModalidadesComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public url = `${this.baseUrl}/modalidade`;

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    public novoCadastro = false;
    public mostrarEditarModalidade = false;

    public listaModalidades: Array<{ id: string; nm_modalidade: string; tp_modalidade: string }> = [];
    public listaModalidadesFiltrada: Array<{}> = [];
    public inputNomeModalidade: string = "";
    public inputTipoModalidade: string = "";
    public idModalidade = "";

    ngOnInit(): void {
        this.getModalidades();
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["nm_modalidade", "tp_modalidade"];

        this.listaModalidadesFiltrada = this.filterTable(columns, this.listaModalidades, conteudo);
        this.pagAtual = 1;
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public async getModalidades() {
        this.listaModalidades = await this.getInfo(this.paths.modalidade, this.setToken);

        this.listaModalidadesFiltrada = this.listaModalidades;
    }

    public async sendModalidade() {
        const formModalidade = new FormData();
        formModalidade.append("nm_modalidade", this.inputNomeModalidade.toUpperCase());
        formModalidade.append("tp_modalidade", this.inputTipoModalidade.toUpperCase());

        await this.postInfo(this.paths.modalidade, formModalidade, this.setToken);

        this.inputNomeModalidade = '';
        this.inputTipoModalidade = '';
        this.getModalidades();
    }

    public cancelarCadastro(item) {
        this.inputNomeModalidade = "";
        this.inputTipoModalidade = "";
        this.idModalidade = "";
        item.mostrarEditarModalidade = false;
    }

    public mostrarEdicaoModalidade(item) {
        item.mostrarEditarModalidade = true;
    }

    public async editarModalidade(item) {
        this.idModalidade = item.id;
        const path = this.paths.modalidade + `/${this.idModalidade}`;

        const formEditarModalidade = new FormData();
        formEditarModalidade.append("nm_modalidade", item.nm_modalidade.toUpperCase());
        formEditarModalidade.append("tp_modalidade", item.tp_modalidade.toUpperCase());

        let putInfoModalidade = await this.putInfo(path, formEditarModalidade, this.setToken);

        if (putInfoModalidade.status == 200) {
            this.getModalidades();
            this.cancelarCadastro(item);
        }
    }

    public async excluir(item) {
        this.idModalidade = item.id;

        const path = this.paths.modalidade + `/${this.idModalidade}`;

        await this.deleteInfo(path, this.setToken);

        this.idModalidade = "";
        this.getModalidades();
    }
}
