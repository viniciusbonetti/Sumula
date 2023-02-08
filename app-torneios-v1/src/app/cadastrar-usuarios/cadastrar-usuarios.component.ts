import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-cadastrar-usuarios",
    templateUrl: "./cadastrar-usuarios.component.html",
    styleUrls: ["./cadastrar-usuarios.component.css"],
})
export class CadastrarUsuariosComponent implements OnInit {
    public singupEmailGetter: string = "";
    public singupPasswordGetter: string = "";
    public singupConfirmPasswordGetter: string = "";
    public singupUsernameGetter: string = "";

    public singupPasswordConfirmed: string = "";

    public userSingupFormObject: object = {};

    public tenantActive = true;

    constructor (private router: Router){}

    ngOnInit(){}


    public enviar(){
        this.tenantActive = false;

        this.router.navigate(['/home']);
    }
}
