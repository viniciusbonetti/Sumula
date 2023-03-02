import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import axios from "axios";
import { ControllerComponent } from "src/app/controller/controller.component";

declare var $: any;

@Component({
    selector: "app-login-cmp",
    templateUrl: "./login.component.html",
})
export class LoginComponent extends ControllerComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    constructor(private element: ElementRef, private router: Router) {
        super();
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
        const body = document.getElementsByTagName("body")[0];
        body.classList.add("login-page");
        body.classList.add("off-canvas-sidebar");
        const card = document.getElementsByClassName("card")[0];
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            card.classList.remove("card-hidden");
        }, 200);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName("body")[0];
        var sidebar = document.getElementsByClassName("navbar-collapse")[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add("toggled");
            }, 500);
            body.classList.add("nav-open");
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove("toggled");
            this.sidebarVisible = false;
            body.classList.remove("nav-open");
        }
    }
    ngOnDestroy() {
        const body = document.getElementsByTagName("body")[0];
        body.classList.remove("login-page");
        body.classList.remove("off-canvas-sidebar");
    }

    public inputUserLogin: string = "";
    public inputUserPassword: string = "";

    public validatedLogin: boolean = false;
    public logadoTenant = true;

    public tenantList = [];
    public tenantSelect = "";

    public config = {};

    public sendLogin = async (event: any) => {
        (event.target as HTMLButtonElement).disabled = true;
        const path = this.baseUrl + this.paths.login;
        var loginObject = { ds_email: this.inputUserLogin, sn_usuario: this.inputUserPassword };

        try {
            let sendInfo = await axios.post(path, loginObject);
            const token = "Bearer " + sendInfo.data.data.token;
            this.config = { headers: { Authorization: token } };
            localStorage.setItem("Authorization", token);
            localStorage.setItem("Id", sendInfo.data.data.id_usuario);

            this.validatedLogin = true;
            this.getTenant();
        } catch (errors) {
            var erro = errors.response.data.data;
            if (erro.type === Array) {
                for (let i = 0; i < erro.length; i++) {
                    var input = document.getElementsByName(erro[i].campo);
                    input[0].parentElement.classList.add("has-danger");
                    input[0].parentElement.parentElement.parentElement.parentElement.nextElementSibling.classList.add("text-danger");
                    input[0].parentElement.parentElement.parentElement.parentElement.nextElementSibling.innerHTML = erro[i].mensagem;
                }
            } else {
                this.showToast("bottom", erro, "danger");
            }
            (event.target as HTMLButtonElement).disabled = false;
        }
    };
    
    public async getTenant() {
        let getId = localStorage.getItem("Id");
        let getToken = localStorage.getItem("Authorization");
        let headers = { Authorization: getToken, "Content-Type": "application/json" };
        let setToken: any = { headers: headers };
        
        const formTenant = new FormData();
        formTenant.append("id_usuario", getId);
        formTenant.append("tipo_request", "tenantUser");

        this.tenantList = await this.postInfo(this.paths.geral, formTenant, setToken);        
    }

    public enviar() {
        if (this.tenantSelect !== "") {
            localStorage.setItem("tenant", this.tenantSelect);
            this.router.navigate(["/dashboard"]);            
            this.logadoTenant = true;
        }
    }
}