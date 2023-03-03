import { Component, OnInit } from "@angular/core";
import { ControllerComponent } from "src/app/controller/controller.component";

@Component({
    selector: "app-atleta",
    templateUrl: "./atleta.component.html",
    styleUrls: ["./atleta.component.css"],
})
export class AtletaComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");

    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken: any = { headers: this.headers };
    public headers2 = { Authorization: this.getToken };
    public setToken2: any = { headers: this.headers2 };

    public inputApelidoAtleta: string = "";
    public inputEmailAtleta: string = "";
    public inputNomeCompletoAtleta: string = "";
    public inputDataNascimentoAtleta: string = "";
    public inputEnderecoAtleta: string = "";
    public inputNmrEnderecoAtleta: string = "";
    public inputCepAtleta: string = "";
    public inputNumeroDocumentoAtleta: string = "";
    public inputContatoAtleta: string = "";
    public inputEditarNumeroDocumentoAtleta: string = "";
    public inputEditarContatoAtleta: string = "";

    public listaAtletas: Array<{ id: string; nm_atleta: string; nm_apelido: string; dt_nascimento: string; tp_genero: string; ds_endereco: string; nr_endereco: string; nr_cep: string; id_estado: string; id_municipio: string }> = [];
    public listaEstado: Array<{}> = JSON.parse(localStorage.getItem("listaEstados"));
    public listaMunicipio: Array<{}> = [];
    public listaModalidades: Array<{}> = [];
    public checkboxAtleta: Array<{}> = [];
    public listaDocumentoAtleta: Array<{}> = [];
    public listaContatoAtleta: Array<{}> = [];
    public listaAtletasFiltrada: Array<{}> = [];

    public estadoSelect = "";
    public municipioSelect = "";
    public generoSelect = "";
    public modalidadeSelect = "";
    public documentoAtletaSelect = "";
    public contatoSelect = "";
    public editarDocumentoAtletaSelect = "";
    public editarContatoSelect = "";

    public novoCadastro: boolean = false;
    public editar: boolean = false;
    public mostrarEditarDocumento: boolean = false;
    public mostrarEditarContato: boolean = false;
    public editarFormAtleta: boolean = false;

    public num = "";
    public idAtleta: string = "";
    public extension = "";
    public image = "";
    public editarImage = "";

    ngOnInit(): void {
        this.getListaAtletas();
        this.getModalidades();
    }

    public searchTable(event: any) {
        const conteudo = event.target.value.toUpperCase();
        const columns = ["id", "nm_atleta", "nm_apelido", "dt_nascimento", "tp_genero", "id_municipio.nm_municipio", "id_municipio.estado.sg_estado"];

        this.listaAtletasFiltrada = this.filterTable(columns, this.listaAtletas, conteudo);
        this.pagAtual = 1;
    }

    public async getListaAtletas() {
        this.listaAtletas = await this.getInfo(this.paths.atleta, this.setToken);

        // Tratamento para a coluna tp_genero
        this.listaAtletas.forEach(la => {
            la['tp_genero'] = la['tp_genero'] == 'm' ? 'Masculino' : 'Feminino';
        });

        this.listaAtletasFiltrada = this.listaAtletas;
    }

    public cadastrar() {
        this.novoCadastro = true;
    }

    public botaoAvancar() {
        if (this.num == "") {
            if (this.editarFormAtleta) {
                this.sendFormAtleta('put');
            } else {
                this.sendFormAtleta('post');
            }
        } else if (this.num == "1") {
            if (this.checkboxAtleta.length > 0) {
                if(this.editar){
                    this.sendModalidadesAtleta('put');
                }else {
                    this.sendModalidadesAtleta('post');
                }
                this.num = "2";
            } else {
                this.sendModalidadesAtleta('post');
            }
        } else if (this.num == "2") {
            if (this.listaDocumentoAtleta.length > 0) {
                this.num = "3";
            } else {
                this.sendDocumentoAtleta('post','');
            }
        } else if(this.num == '3'){
            alert("informações salvas");
            this.num = "";
            this.finalizarCadastro();
        }
    }

    public botaoVoltar() {
        if (this.num == "") {
            this.limparFormContatoAtleta();
            this.limparFormDocumentoAtleta();
        } else if (this.num == "1") {
            if(this.editar){
                this.sendModalidadesAtleta('put');
            }else {
                this.sendModalidadesAtleta('post');
            }
            this.editarFormAtleta = true;
            this.num = "";
        } else if (this.num == "2") {
            this.getModalidadesRegistro();
            this.editar = true;
            this.num = "1";
        } else if (this.num == "3") {
            this.num = "2";
        }
    }

    public finalizarCadastro() {
        this.idAtleta = "";
        this.novoCadastro = false;
        this.editarFormAtleta = false;
        this.editar = false;
    }

    public async getListaMunicipio() {
        const path = this.paths.municipio + `/${this.estadoSelect}`;
        this.listaMunicipio = await this.getInfo(path, this.setToken);
    }

    public async sendFormAtleta(metodo) {
        const formAtleta = new FormData();
        formAtleta.append("nm_atleta", this.inputNomeCompletoAtleta);
        formAtleta.append("nm_apelido", this.inputApelidoAtleta);
        formAtleta.append("tp_genero", this.generoSelect);
        formAtleta.append("dt_nascimento", this.inputDataNascimentoAtleta);
        formAtleta.append("ds_endereco", this.inputEnderecoAtleta);
        formAtleta.append("nr_endereco", this.inputNmrEnderecoAtleta);
        formAtleta.append("id_municipio", this.municipioSelect);
        formAtleta.append("nr_cep", this.inputCepAtleta);
        if(metodo == 'post'){
            let sendAtleta = await this.postInfo(this.paths.atleta, formAtleta, this.setToken);
            this.idAtleta = sendAtleta.id;
        }else if(metodo == 'put'){
            formAtleta.append('id_atleta', this.idAtleta)
            const path = this.paths.atleta + `/${this.idAtleta}`;
            await this.putInfo(path, formAtleta, this.setToken);
        }

        if (this.axiosResponse == true) {
            this.num = "1";
            if(this.editar){
                this.getEdits();
            }
        }
    }

    public getEdits() {
        this.getModalidadesRegistro();
        this.getDocumentoAtleta();
        this.getContatoAtleta();
    }
    
    public async getModalidades() {
        this.listaModalidades = await this.getInfo(this.paths.modalidade, this.setToken);
    }

    public setCheckbox(id, isChecked) {
        if (isChecked.checked) {
            this.checkboxAtleta.push(id);
        } else {
            let index = this.checkboxAtleta.findIndex((x) => x == id);
            this.checkboxAtleta.splice(index, 1);
        }
    }

    public async sendModalidadesAtleta(metodo) {
        const formModalidadeAtleta = new FormData();
        formModalidadeAtleta.append("id_modalidade", this.checkboxAtleta.toString());
        formModalidadeAtleta.append("id_atleta", this.idAtleta);
        formModalidadeAtleta.append("st_ativo", "true");

        if(metodo == 'post'){
            await this.postInfo(this.paths.modalidadeatleta, formModalidadeAtleta, this.setToken);
        }else if(metodo == 'put'){
            const path = this.paths.modalidadeatleta + `/${this.idAtleta}`
            await this.putInfo(path, formModalidadeAtleta, this.setToken);
        }
        this.getModalidadesRegistro();
        this.checkboxAtleta = [];
    }

    public adicionarFotoDocumento(event) {
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

    public async sendDocumentoAtleta(metodo, item) {
        const formDocumentoAtleta = new FormData();

        if(metodo == 'post'){
            formDocumentoAtleta.append("id_atleta", this.idAtleta);
            formDocumentoAtleta.append("tp_documento", this.documentoAtletaSelect);
            formDocumentoAtleta.append("nr_documento", this.inputNumeroDocumentoAtleta);
            formDocumentoAtleta.append("image", this.image);    
            await this.postInfo(this.paths.documentoatleta, formDocumentoAtleta, this.setToken2);
            this.limparFormDocumentoAtleta();
        } else if(metodo == 'put'){
            formDocumentoAtleta.append("id_atleta", this.idAtleta);
            formDocumentoAtleta.append("tp_documento", this.editarDocumentoAtletaSelect);
            formDocumentoAtleta.append("nr_documento", this.inputEditarNumeroDocumentoAtleta);
            formDocumentoAtleta.append("image", this.image);
            const path = this.paths.documentoatleta + `/${item.id}`;
            await this.putInfo(path, formDocumentoAtleta, this.setToken);
        }
        this.getDocumentoAtleta();
    }

    public async getDocumentoAtleta() {
        const urlGetDocumentoAtleta = this.paths.documentoatleta + `/t${this.idAtleta}`;
        this.listaDocumentoAtleta = await this.getInfo(urlGetDocumentoAtleta, this.setToken);
    }

    public editarDocumentoAtleta(item){        
        item.mostrarEditarDocumento = true;
        this.editarDocumentoAtletaSelect = item.tp_documento;
        this.inputEditarNumeroDocumentoAtleta = item.nr_documento;
        this.image = item.ds_midia;
    }

    public limparFormDocumentoAtleta() {
        this.documentoAtletaSelect = "";
        this.inputNumeroDocumentoAtleta = "";
        this.image = "";
    }

    public async sendContatoAtleta(metodo, item) {
        const formContatoAtleta = new FormData();
        if(metodo == 'post'){
            formContatoAtleta.append("id_atleta", this.idAtleta);
            formContatoAtleta.append("tp_contato", this.contatoSelect);
            formContatoAtleta.append("ds_contato", this.inputContatoAtleta);            
            await this.postInfo(this.paths.contatoatleta, formContatoAtleta, this.setToken);
            this.limparFormContatoAtleta();
        }else if(metodo == 'put'){
            formContatoAtleta.append("id_atleta", this.idAtleta);
            formContatoAtleta.append("tp_contato", this.editarContatoSelect);
            formContatoAtleta.append("ds_contato", this.inputEditarContatoAtleta);
            const path = this.paths.contatoatleta + `/${item.id}`;
            await this.putInfo(path, formContatoAtleta, this.setToken);
        }
        
        this.getContatoAtleta();
    }

    public async getContatoAtleta() {
        const urlGetContatoAtleta = this.paths.contatoatleta + `/t${this.idAtleta}`;
        this.listaContatoAtleta = await this.getInfo(urlGetContatoAtleta, this.setToken);
    }

    public editarContatoAtleta(item){
        item.mostrarEditarContato = true;
        this.editarContatoSelect = item.tp_contato;
        this.inputEditarContatoAtleta = item.ds_contato;
    }

    public limparFormContatoAtleta() {
        this.contatoSelect = "";
        this.inputContatoAtleta = "";
    }

    public async mostrarEdicaoAtleta(item) {
        this.novoCadastro = true;
        this.editarFormAtleta = true;
        this.editar = true;
        this.idAtleta = item.id;
        
        this.inputNomeCompletoAtleta = item.nm_atleta;
        this.inputApelidoAtleta = item.nm_apelido;
        this.inputDataNascimentoAtleta = item.dt_nascimento;
        this.generoSelect = (item.tp_genero == 'Masculino') ? 'm' : 'f';
        this.inputEnderecoAtleta = item.ds_endereco;
        this.inputNmrEnderecoAtleta = item.nr_endereco;
        this.inputCepAtleta = item.nr_cep;
        this.estadoSelect = item.id_municipio.id_estado;
        this.municipioSelect = item.id_municipio.id;

        this.getListaMunicipio();
    }

    public async getModalidadesRegistro() {
        const path = this.paths.modalidadeatleta + `/t${this.idAtleta}`;
        let listaModalidadesRegistro = await this.getInfo(path, this.setToken); 
               
        listaModalidadesRegistro.forEach((element) => {
            this.listaModalidades.forEach((element2) => {
                if (element2["id"] == element.st_ativo) {                    
                    element2["checked"] = true;
                    this.checkboxAtleta.push(element.id_modalidade.id);
                }
            });
        });
    }

    public cancelar(tela, item) {
        if (tela == 'atleta'){
            this.inputNomeCompletoAtleta = "";
            this.inputApelidoAtleta = "";
            this.inputDataNascimentoAtleta = "";
            this.generoSelect = "";
            this.inputEnderecoAtleta = "";
            this.inputNmrEnderecoAtleta = "";
            this.inputCepAtleta = "";
            this.estadoSelect = "";
            this.municipioSelect = "";
            this.novoCadastro = false;
            this.editar = false;
        }else if(tela == 'documento'){
            item.mostrarEditarDocumento = false;
            this.mostrarEditarDocumento = false;
        } else if(tela == 'contato'){
            item.mostrarEditarContato = false;
            this.mostrarEditarContato = false;
        }
    }

    public async excluir(item, tela) {
        const type = "warning-message-and-cancel";
        if (tela == "atleta") {
            this.mensagemTitulo = "Deseja deletar o atleta?";
            this.mensagemAlerta = "Esta ação não será reversível e irá deletar todos os registros relacionados ao atleta!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.atleta + `/${item.id}`;
                await this.deleteInfo(path, this.setToken);
                this.getListaAtletas();
            }
        } else if (tela == "documento") {
            this.mensagemTitulo = "Deseja deletar o documento deste atleta?";
            this.mensagemAlerta = "Esta ação não será reversível!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.documentoatleta + `/i${item.id}&t${this.idAtleta}`;
                await this.deleteInfo(path, this.setToken);
                this.getDocumentoAtleta();
            }
        } else if (tela == "contato") {
            this.mensagemTitulo = "Deseja deletar o contato deste atleta?";
            this.mensagemAlerta = "Esta ação não será reversível!";
            await this.showSwal(type);
            if (this.resultado) {
                const path = this.paths.contatoatleta + `/i${item.id}&t${this.idAtleta}`;
                await this.deleteInfo(path, this.setToken);
                this.getContatoAtleta();
            }
        }
    }
}
