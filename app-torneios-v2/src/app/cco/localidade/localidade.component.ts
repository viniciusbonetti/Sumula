import { Component, OnInit } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";

@Component({
    selector: "app-localidade",
    templateUrl: "./localidade.component.html",
    styleUrls: ["./localidade.component.css"],
})
export class LocalidadeComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };

    public listaLocalidades: Array<{ id: string; nm_cargo: string }> = [];
    public listaLocalidadesFiltrada: Array<{ id: string; nm_cargo: string }> = [];

    public novoCadastro: boolean = false;
    public mostrarEditarLocalidade: boolean = false;

    public inputNomeLocalidade:string = '';
    public inputEnderecoLocalidade:string = '';
    public inputNumeroLocalidade:string = '';
    public inputBairroLocalidade:string = '';

    ngOnInit(): void {
      this.getListaLocalidades();
    }

    public cadastrar() {
        this.novoCadastro = !this.novoCadastro;
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["id", "nm_cargo"];

        this.listaLocalidadesFiltrada = this.filterTable(columns, this.listaLocalidades, conteudo);
        this.pagAtual = 1;
    }

    public async getListaLocalidades() {
        const path = this.paths.localidades + `/t${this.tenant}`;
        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaLocalidades = resposta.data.data;
            this.listaLocalidadesFiltrada = this.listaLocalidades;
        }
    }

    public async cadastrarLocalidade(event){
      (event.target as HTMLButtonElement).disabled = true;
      const formLocalidade = new FormData();
      formLocalidade.append("ds_localidade", this.inputNomeLocalidade);
      formLocalidade.append("ds_endereco", this.inputNomeLocalidade);
      formLocalidade.append("nr_localidade", this.inputNomeLocalidade);
      formLocalidade.append("ds_bairro", this.inputNomeLocalidade);
      formLocalidade.append("id_municipio", '');
      formLocalidade.append("id_tenant", this.tenant);

      await this.postInfo(this.paths.localidades, formLocalidade, this.setToken);

      this.inputNomeLocalidade = "";
      this.getListaLocalidades();
      this.showToast("bottom", "Registro de localidade criado com sucesso!", "success");
      (event.target as HTMLButtonElement).disabled = false;
    }
}
