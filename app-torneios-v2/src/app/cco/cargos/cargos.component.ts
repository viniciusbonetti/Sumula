import { Component, OnInit } from '@angular/core';
import { ControllerComponent } from 'src/app/controller/controller.component';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent extends ControllerComponent implements OnInit {
  public getToken = localStorage.getItem("Authorization");
  public tenant = localStorage.getItem("tenant");

  public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
  public setToken = { headers: this.headers };

  public novoCadastro = false;
  public mostrarEditarCargo = false;

  public listaCargosCco: Array<{ id: string; nm_cargo: string }> = [];
  public inputNomeCargo: string = "";
  public inputEditarCargo: string = "";
  public idCargo = "";

  ngOnInit(): void {
      this.getListaCargos();
  }

  public cadastrar() {
      this.novoCadastro = !this.novoCadastro;
  }

  public async getListaCargos() {
      const path = this.paths.cargocco + `/t${this.tenant}`;
      this.listaCargosCco = await this.getInfo(path, this.setToken);
  }

  public async sendCargo() {        
      const formCargo = new FormData();
      formCargo.append("nm_cargo", this.inputNomeCargo);
      formCargo.append("id_tenant", this.tenant);

      await this.postInfo(this.paths.cargocco, formCargo, this.setToken);

      this.inputNomeCargo = "";
      this.getListaCargos();
  }

  public cancelarCadastro() {
      this.inputNomeCargo = "";

      this.novoCadastro = false;
  }

  public mostrarEdicaoCargo(item, listaCargos) {
      listaCargos.forEach(element => {
          element.mostrarEditarCargo = false
      });
      item.mostrarEditarCargo = true;
  }

  public async editarCargo(item) {
      this.idCargo = item.id;

      const path = this.paths.cargocco + `/${this.idCargo}`;

      const formEditarCargo = new FormData();
      formEditarCargo.append("nm_cargo", item.nm_cargo);
      formEditarCargo.append("id_tenant", this.tenant);

      await this.putInfo(path, formEditarCargo, this.setToken);

      this.idCargo = '';
      this.getListaCargos();
  }

  public async excluir(item){
      this.idCargo = item.id;
      
      const path = this.paths.cargocco + `/${this.idCargo}`

      await this.deleteInfo(path, this.setToken);

      this.idCargo = '';
      this.getListaCargos();
  }

  public cancelarEdicao(item){
      item.mostrarEditarCargo = false;
  }
}
