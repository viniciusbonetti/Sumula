import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ControllerComponent } from "src/app/controller/controller.component";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
    selector: "app-inscricao-atleta",
    templateUrl: "./inscricao-atleta.component.html",
    styleUrls: ["./inscricao-atleta.component.css"],
})
export class InscricaoAtletaComponent extends ControllerComponent implements OnInit {
    // headers
    public getToken = localStorage.getItem("Authorization");
    public tenant = localStorage.getItem("tenant");
    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken = { headers: this.headers };
    
    // listas
    public listaEventos:Array<{}> = [];
    public listaModalidadesEvento:Array<{}> = [];
    public listaDelegacaoEvento:Array<{}> = [];
    public listaAtletas:Array<{}> = [];
    
    // select
    public selectEvento:string = '';
    public selectModalidadeEvento:string = '';
    public selectDelegacaoEvento:string = '';
    
    // formcontrol
    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    
    ngOnInit(): void {
        this.getEventos();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
    }

    public async getEventos(){
        const path = this.paths.evento + `/t${this.tenant}`;
        let resposta = await this.getInfo(path, this.setToken);
        this.listaEventos = resposta.data.data;
    }

    public async getModalidadesEvento(idEvento){
        this.listaModalidadesEvento = [];
        this.selectModalidadeEvento = '';
        this.selectDelegacaoEvento = '';
        const path = this.paths.modalidadeevento + `/i${idEvento}&t${this.tenant}`;
        let resposta = await this.getInfo(path, this.setToken);
        if (resposta.status == 200) {
            this.listaModalidadesEvento = resposta.data.data;
        }
    }

    public async getDelegacaoEvento(modalidadeEvento){
        const path = this.paths.inscricaodelegacao + `/m${modalidadeEvento}&t${this.tenant}`;

        let resposta = await this.getInfo(path, this.setToken);
        this.listaDelegacaoEvento = resposta.data.data;
        this.getAtletas();
    }

    public async getAtletas(){
        let resposta = await this.getInfo(this.paths.atleta, this.setToken);
        if(resposta.status == 200){
            this.listaAtletas = resposta.data.data;
        }
    }

    public keyUp(inputValue){
        console.log(inputValue);
        
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
      }
}
