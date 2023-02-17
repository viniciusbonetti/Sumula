import { Component, OnInit } from '@angular/core';
import { ControllerComponent } from 'src/app/controller/controller.component';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent extends ControllerComponent implements OnInit {
  public getToken = localStorage.getItem("Authorization");
  public tenant = localStorage.getItem("tenant");
  public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
  public urlGet = `${this.baseUrl}/evento/t${this.tenant}`;
  public urlPost = `${this.baseUrl}/evento/`;

  public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
  public setToken = { headers: this.headers };

  public novoCadastro = false;
  public editar = false;
  public editarModalidadeEvento = false;

  public listaEventos: Array<{ id: string; nm_evento: string; dt_inicio: string; dt_fim: string; nm_tenant: string }> = [];
  public listaEstado: Array<{}> = JSON.parse(localStorage.getItem("listaEstados"));
  public listaCargosCco: Array<{}> = [];
  public listaTiposDocumentos: Array<{}> = [];
  public listaOcupantes: Array<{}> = [];
  public listaMunicipios: Array<{}> = [];
  public listaMunicipiosEvento: Array<{}> = [];
  public listaModalidades: Array<{}> = [];
  public listaModalidadesEvento: Array<{}> = [];
  public listaNaipe: Array<{}> = [];

  public inputNomeEvento: string = "";
  public inputDataInicio: string = "";
  public inputDataFim: string = "";
  public inputNomeTenant: string = "";
  public inputNomeOcupante: string = "";
  public inputNumeroDocumento: string = "";
  public inputIdadeInicial: string = "";
  public inputIdadeFinal: string = "";
  public inputEditarIdadeInicial: string = "";
  public inputEditarIdadeFinal: string = "";

  public cargoSelect = "";
  public estadoSelect = "";
  public municipioSelect = "";
  public documentoSelect = "";
  public modalidadeSelect = "";
  public naipeSelect = "";
  public editarModalidadeSelect = "";
  public editarNaipeSelect = "";

  public idEditarEvento = "";
  public idEvento = "";
  public idRegistroModalidade = "";

  public num = "";

  ngOnInit(): void {
      this.getEventos();
  }

  public cadastrar() {
      this.novoCadastro = !this.novoCadastro;
  }

  public botaoAvancar() {
      if (this.num == "") {
          if(this.editar){
              this.editarNomeEvento();
          }else {
              this.sendEventos();
          }
          this.getCargosCco();
      } else if (this.num == "1") {
          if(this.listaModalidadesEvento.length > 0){
              this.num = '2';
          }else {
              alert('cadastre uma modalidade')
          }
          this.getOcupantes();
      }else if(this.num == "2"){
          if(this.listaOcupantes.length > 0){
              this.num = '3';
          }else{
              this.sendNovoOcupante();
          }
          this.getMunicipiosEvento();
      }
  }

  public async getEventos() {
      const path = this.paths.evento + `/t${this.tenant}`
      this.listaEventos = await this.getInfo(path, this.setToken);
  }

  public async sendEventos() {
      const formEventos = new FormData();
      formEventos.append("nm_evento", this.inputNomeEvento);
      formEventos.append("dt_inicio", this.inputDataInicio);
      formEventos.append("dt_fim", this.inputDataFim);
      formEventos.append("id_tenant", this.tenant);

      let sendInfoEvento = await this.postInfo(this.paths.evento, formEventos, this.setToken);

      this.idEvento = sendInfoEvento.id;
      this.inputNomeEvento = "";
      this.inputDataInicio = "";
      this.inputDataFim = "";
      this.inputNomeTenant = "";
      
      this.getModalidades();
      this.num = "1";
  }

  public cancelarCadastro() {
      this.inputNomeEvento = "";
      this.inputDataInicio = "";
      this.inputDataFim = "";
      this.inputNomeTenant = "";
      this.novoCadastro = !this.novoCadastro;
  }

  public async getModalidades() {
      this.listaModalidades = await this.getInfo(this.paths.modalidade, this.setToken);
  }

  public async sendModalidadesEvento(metodo, item) {        
      if (metodo == 'post'){
          const formModalidadeEvento = new FormData();
          formModalidadeEvento.append("id_tenant", this.tenant);
          formModalidadeEvento.append("id_evento", this.idEvento);
          formModalidadeEvento.append("id_modalidade", this.modalidadeSelect);
          formModalidadeEvento.append("nr_idadeinicio", this.inputIdadeInicial);
          formModalidadeEvento.append("nr_idadefinal", this.inputIdadeFinal);
          formModalidadeEvento.append("tp_naipe", this.naipeSelect);
          await this.postInfo(this.paths.modalidadeevento, formModalidadeEvento, this.setToken);
      } else if (metodo == 'put'){
          const formEditarModaidadeEvento = new FormData();
          formEditarModaidadeEvento.append("id_tenant", this.tenant);
          formEditarModaidadeEvento.append("id_evento", this.idEvento);
          formEditarModaidadeEvento.append("id_modalidade", this.editarModalidadeSelect);
          formEditarModaidadeEvento.append("nr_idadeinicio", this.inputEditarIdadeInicial);
          formEditarModaidadeEvento.append("nr_idadefinal", this.inputEditarIdadeFinal);
          formEditarModaidadeEvento.append("tp_naipe", this.editarNaipeSelect);
          const path = this.paths.modalidadeevento + `/${item.id}`
          await this.putInfo(path, formEditarModaidadeEvento, this.setToken)
      }

      this.modalidadeSelect = '';
      this.inputIdadeInicial = '';
      this.inputIdadeFinal = '';
      this.naipeSelect = '';
      this.getModalidadesEvento();
  }

  public async getModalidadesEvento() {
      const path = this.paths.modalidadeevento + `/i${this.idEvento}&t${this.tenant}`;

      this.listaModalidadesEvento = await this.getInfo(path, this.setToken);
  }

  public async getCargosCco() {
      const path = this.paths.cargocco + `/t${this.tenant}`;

      this.listaCargosCco = await this.getInfo(path, this.setToken);
  }

  public async sendNovoOcupante() {
      const formOcupante = new FormData();
      formOcupante.append("id_tenant", this.tenant);
      formOcupante.append("id_evento", this.idEvento);
      formOcupante.append("id_cargocco", this.cargoSelect);
      formOcupante.append("nm_ocupante", this.inputNomeOcupante);
      formOcupante.append("tp_documento", this.documentoSelect);
      formOcupante.append("nr_documento", this.inputNumeroDocumento);

      await this.postInfo(this.paths.ccoevento, formOcupante, this.setToken);

      this.limparFormOcupante();
  }

  public limparFormOcupante() {
      this.cargoSelect = "";
      this.inputNomeOcupante = "";
      this.documentoSelect = "";
      this.inputNumeroDocumento = "";
  }

  public async getOcupantes() {
      const path = this.paths.ccoevento + `/i${this.idEvento}&t${this.tenant}`;
      this.listaOcupantes = await this.getInfo(path, this.setToken);
  }

  public async getMunicipio() {
      const path = this.paths.municipio + `/${this.estadoSelect}`;
      this.listaMunicipios = await this.getInfo(path, this.setToken);
  }

  public async cadastrarNovoMunicipio(metodo, item) {
      const formMunicipioEvento = new FormData();
      formMunicipioEvento.append("id_evento", this.idEvento);
      formMunicipioEvento.append("id_municipio", this.municipioSelect);
      formMunicipioEvento.append("id_tenant", this.tenant);

      if(metodo == 'post'){
          await this.postInfo(this.paths.municipioevento, formMunicipioEvento, this.setToken);
      } else if(metodo == 'put'){
          const path = this.paths.municipioevento + `/${item.id}`;
          await this.putInfo(path, formMunicipioEvento, this.setToken);
      }

      this.getMunicipiosEvento();
  }

  public async getMunicipiosEvento() {
      const path = this.paths.municipioevento + `/i${this.idEvento}&t${this.tenant}`;

      this.listaMunicipiosEvento = await this.getInfo(path, this.setToken);
  }

  public async editarEvento(item){
      this.novoCadastro = true;
      this.editar = true;
      this.idEvento = item.id;
      
      const path = this.paths.evento + `/i${item.id}&t${this.tenant}`

      let getInfoEvento = await this.getInfo(path, this.setToken)

      this.inputNomeEvento = getInfoEvento[0].nm_evento;
      this.inputDataInicio = getInfoEvento[0].dt_inicio;
      this.inputDataFim = getInfoEvento[0].dt_fim;
  }

  public async editarNomeEvento(){
      const path = this.paths.evento + `/${this.idEvento}`;

      const formEditarEvento = new FormData();
      formEditarEvento.append('nm_evento', this.inputNomeEvento);
      formEditarEvento.append("dt_inicio", this.inputDataInicio);
      formEditarEvento.append("dt_fim", this.inputDataFim);
      formEditarEvento.append("id_tenant", this.tenant);

      await this.putInfo(path, formEditarEvento, this.setToken);
      this.num = "1";

      this.getModalidades();
      this.getModalidadesEvento();
  }

  public mostrarEditarModalidade(item) {
      item.editarModalidadeEvento = true;
      this.editarModalidadeSelect = item.id_modalidade.id;
      this.inputEditarIdadeInicial = item.nr_idadeinicio;
      this.inputEditarIdadeFinal = item.nr_idadefinal;
      this.editarNaipeSelect = item.tp_naipe;
  }

  public async excluir(item){
      this.idRegistroModalidade = item.id;
      
      const path = this.paths.modalidadeevento + `/${this.idRegistroModalidade}`

      await this.deleteInfo(path, this.setToken);

      this.idRegistroModalidade = '';
      this.getModalidadesEvento();
  }
}
