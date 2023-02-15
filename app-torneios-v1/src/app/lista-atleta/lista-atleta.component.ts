import { Component, OnInit } from "@angular/core";
import axios from "axios";

@Component({
    selector: "lista-atleta",
    templateUrl: "./lista-atleta.component.html",
    styleUrls: ["./lista-atleta.component.css"],
})
export class ListaAtletaComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    // public tenant = localStorage.getItem("tenant");
    public baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
    public headers = { Authorization: this.getToken };
    public setToken = { headers: this.headers };

    
    constructor() {}
    
    ngOnInit(): void {
    }
    
    
}
