import { Component, OnInit } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";

@Component({
    selector: "app-localidade",
    templateUrl: "./localidade.component.html",
    styleUrls: ["./localidade.component.css"],
})
export class LocalidadeComponent extends ControllerComponent implements OnInit {
    // header e token
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    // listas
    public listaEstado: Array<{}> = JSON.parse(localStorage.getItem("listaEstados"));
    public listaLocalidades: Array<{}> = [];
    public listaLocalidadesFiltrada: Array<{}> = [];
    public listaMunicipio: Array<{}> = [];

    // booleans
    public novoCadastro: boolean = false;
    public editar: boolean = false;

    // inputs
    public inputNomeLocalidade: string = "";
    public inputEnderecoLocalidade: string = "";
    public inputNumeroLocalidade: string = "";
    public inputBairroLocalidade: string = "";

    // selects
    public estadoSelect: string = "";
    public municipioSelect: string = "";

    // registro
    public idRegistroLocalidade = "";

    ngOnInit(): void {
        this.getListaLocalidades();
    }

    public async getListaLocalidades() {
        const path = this.paths.localidades + `/t${this.tenant}`;
        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaLocalidades = resposta.data.data;
            this.listaLocalidadesFiltrada = this.listaLocalidades;
        }
    }

    public cadastrar() {
        this.novoCadastro = true;
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["id", "ds_localidade"];

        this.listaLocalidadesFiltrada = this.filterTable(columns, this.listaLocalidades, conteudo);
        this.pagAtual = 1;
    }

    public async botaoAvancar(metodo, event) {
        (event.target as HTMLButtonElement).disabled = true;
        if (this.editar) {
            await this.cadastrarLocalidade(metodo);
        } else {
            await this.cadastrarLocalidade(metodo);
        }
        (event.target as HTMLButtonElement).disabled = false;
    }

    public cancelar() {
        this.limparFormLocalidade();
        this.novoCadastro = false;
        this.editar = false;
    }

    public limparFormLocalidade() {
        this.inputNomeLocalidade = "";
        this.inputEnderecoLocalidade = "";
        this.inputNumeroLocalidade = "";
        this.inputBairroLocalidade = "";
        this.estadoSelect = "";
        this.municipioSelect = "";
    }

    public async getListaMunicipio() {
        const path = this.paths.municipio + `/${this.estadoSelect}`;
        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaMunicipio = resposta.data.data;
        }
    }

    public async cadastrarLocalidade(metodo) {
        const formLocalidade = new FormData();
        formLocalidade.append("ds_localidade", this.inputNomeLocalidade);
        formLocalidade.append("ds_endereco", this.inputEnderecoLocalidade);
        formLocalidade.append("nr_localidade", this.inputNumeroLocalidade);
        formLocalidade.append("ds_bairro", this.inputBairroLocalidade);
        formLocalidade.append("id_municipio", this.municipioSelect);
        formLocalidade.append("id_tenant", this.tenant);
        if (metodo == "post") {
            await this.postInfo(this.paths.localidades, formLocalidade, this.setToken);
            this.showToast("bottom", "Registro de localidade criado com sucesso!", "success");
        } else if (metodo == "put") {
            const path = this.paths.localidades + `/${this.idRegistroLocalidade}`;
            await this.putInfo(path, formLocalidade, this.setToken);
            this.showToast("bottom", "Registro de localidade editado com sucesso!", "success");
        }

        if (this.axiosResponse == true) {
            this.getListaLocalidades();
            this.limparFormLocalidade();
            this.cancelar();
            this.novoCadastro = false;
            this.editar = false;
        }
    }

    public async mostrarEdicaoLocalidade(item) {
        this.editar = true;
        this.novoCadastro = true;
        
        this.idRegistroLocalidade = item.id;
        this.inputNomeLocalidade = item.ds_localidade;
        this.inputEnderecoLocalidade = item.ds_endereco;
        this.inputNumeroLocalidade = item.nr_localidade;
        this.inputBairroLocalidade = item.ds_bairro;
        this.estadoSelect = item.id_municipio.id_estado;
        await this.getListaMunicipio();
        this.municipioSelect = item.id_municipio.id;
    }
}
