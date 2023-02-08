import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import axios from "axios";

@Component({
    selector: "cargos-cco",
    templateUrl: "./cargos-cco.component.html",
    styleUrls: ["./cargos-cco.component.css"],
})
export class CargosCcoComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public urlGet = `${this.baseUrl}/cargocco/t${this.tenant}`;
    public urlPost = `${this.baseUrl}/cargocco`;

    public headers = { Authorization:  this.getToken, "Content-Type": "application/json"}
    public setToken = {headers: this.headers}

    public novoCadastro = false;
    public mostrarEditarCargo = false;

    public listaCargosCco: Array<{ id: string; nm_cargo:string}> = [];
    public inputNomeCargo: string = '';
    public inputEditarCargo:string = '';
    public idCargo = '';

    constructor() {}

    ngOnInit(): void {
        this.getCargos();
    }

    public cadastrar(){
        this.novoCadastro = !this.novoCadastro;
    }

    public async getCargos(){
        let getInfo = await axios.get(this.urlGet, this.setToken);

        this.listaCargosCco = getInfo.data.data;
    }

    public async sendCargo(){
        let formCargo = new FormData();
        formCargo.append('nm_cargo', this.inputNomeCargo);
        formCargo.append('id_tenant', this.tenant);

        let sendInfo = await axios.post(this.urlPost, formCargo, this.setToken);
        console.log(sendInfo);
        

        this.inputNomeCargo = '';

        this.getCargos();
    }

    public cancelarCadastro(){
        this.inputNomeCargo = '';
    }

    public mostrarEdicaoCargo(item){
        item.mostrarEditarCargo = true
    }

    public async editarCargo(item){
        try {
            this.idCargo = item.id;
            
            let urlPut = `${this.baseUrl}/cargocco/${this.idCargo}`;

            const formEditarCargo = new FormData();
            formEditarCargo.append('nm_cargo', item.nm_cargo)
            formEditarCargo.append('id_tenant', this.tenant)
            
            // let putInfo = await axios.put(urlPut, {'nm_cargo' : item.nm_cargo, 'id_tenant': this.tenant}, this.setToken)
            let putInfo = await axios.put(urlPut, formEditarCargo, this.setToken)

        }
        catch (error) {
            console.log(error);
        }
    }
}
