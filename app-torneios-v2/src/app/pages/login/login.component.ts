import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'

import axios from 'axios';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    constructor(private element: ElementRef, private router: Router) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            card.classList.remove('card-hidden');
        }, 700);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    ngOnDestroy(){
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('login-page');
      body.classList.remove('off-canvas-sidebar');
    }

    public inputUserLogin: string = "";
    public inputUserPassword: string = "";
    
    public validatedLogin: boolean = false;
    // public cadastrarUsuarioActive: boolean = false;
    public logadoTenant = true;

    public tenantList = [];
    public tenantSelect = '';

    // public headers: { Authorization: string } = { Authorization: '' };
    public config: {} = {};

    public sendLogin = async (event:any) => {
        var logado: boolean = true;
        
        (event.target as HTMLButtonElement).disabled = true;

        if (logado) {
            var loginObject = {
                ds_email: this.inputUserLogin,
                sn_usuario: this.inputUserPassword,
            };
            const baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
            // var headers = {'Authorization': 'Bearer '};
            this.config = {
                headers: { Authorization: "Bearer " },
            };
            const url = `${baseUrl}/login`;
            const url2 = `${baseUrl}/user`;

            try {
                let sendInfo = await axios.post(url, loginObject);

                const token = "Bearer " + sendInfo.data.data.token;
                this.config = {
                    headers: { Authorization: token },
                };
                // console.log(this.config);
                localStorage.setItem("Authorization", token);
                localStorage.setItem("Id", sendInfo.data.data.id_usuario);

                this.validatedLogin = true;
                // this.cadastrarUsuarioActive = true;

                this.getTenant();
                // this.Routes.navigate(['/cadastrar-usuarios'])
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
                    this.showNotification("bottom", "center", erro, "danger");
                }
                (event.target as HTMLButtonElement).disabled = false;
            }            
        }

        return;
    };

    public showNotification(from, align, message, type) {
        $.notify(
            {
                icon: "add_alert",
                message: message,
            },
            {
                type: type,
                timer: 4000,
                placement: {
                    from: from,
                    align: align,
                },
            }
        );
    }

    public async getTenant(){
        const baseUrl = "http://dornez.vps-kinghost.net/sumulaApi/api";
        const url = `${baseUrl}/geral`;
        let setId = localStorage.getItem("Id");
        let getToken = localStorage.getItem("Authorization");
        let headers = { Authorization: getToken, "Content-Type": "application/json" };
        let setToken: any = { headers: headers };
            
        const formTenant = new FormData();
        formTenant.append("id_usuario", setId);
        formTenant.append("tipo_request", "tenantUser");
        let getTenant = await axios.post(url, formTenant, setToken);
        // console.log(getTenant);
        this.tenantList = getTenant.data.data;
        
    }

    public enviar(){
        console.log(this.tenantSelect);
        
        if(this.tenantSelect !== ''){
            localStorage.setItem("tenant", this.tenantSelect);
            this.router.navigate(['/dashboard']);

            // this.cadastrarUsuarioActive = false;
            this.logadoTenant = true;
        }
    }
}
