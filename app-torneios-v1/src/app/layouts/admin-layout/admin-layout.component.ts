import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from "@angular/common";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import PerfectScrollbar from "perfect-scrollbar";
// import * as $ from "jquery";
import { filter, Subscription } from "rxjs";
import axios from "axios";
declare var $: any;

@Component({
    selector: "app-admin-layout",
    templateUrl: "./admin-layout.component.html",
    styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(public location: Location, private router: Router) {}

    ngOnInit() {
        const isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;

        //   if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
        //       // if we are on windows OS we activate the perfectScrollbar function

        //       document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
        //   } else {
        //       document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        //   }
        const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
        const elemSidebar = <HTMLElement>document.querySelector(".sidebar .sidebar-wrapper");

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl) this.yScrollStack.push(window.scrollY);
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else window.scrollTo(0, 0);
            }
        });
        this._router = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            //    elemMainPanel.scrollTop = 0;
            //    elemSidebar.scrollTop = 0;
        });
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            //   let ps = new PerfectScrollbar(elemMainPanel);
            //   ps = new PerfectScrollbar(elemSidebar);
        }

        const window_width = $(window).width();
        let $sidebar = $(".sidebar");
        let $sidebar_responsive = $("body > .navbar-collapse");
        let $sidebar_img_container = $sidebar.find(".sidebar-background");

        if (window_width > 767) {
            if ($(".fixed-plugin .dropdown").hasClass("show-dropdown")) {
                $(".fixed-plugin .dropdown").addClass("open");
            }
        }

        $(".fixed-plugin a").click(function (event) {
            // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
            if ($(this).hasClass("switch-trigger")) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else if (window.event) {
                    window.event.cancelBubble = true;
                }
            }
        });

        $(".fixed-plugin .badge").click(function () {
            let $full_page_background = $(".full-page-background");

            $(this).siblings().removeClass("active");
            $(this).addClass("active");

            var new_color = $(this).data("color");

            if ($sidebar.length !== 0) {
                $sidebar.attr("data-color", new_color);
            }

            if ($sidebar_responsive.length != 0) {
                $sidebar_responsive.attr("data-color", new_color);
            }
        });

        $(".fixed-plugin .img-holder").click(function () {
            let $full_page_background = $(".full-page-background");

            $(this).parent("li").siblings().removeClass("active");
            $(this).parent("li").addClass("active");

            var new_image = $(this).find("img").attr("src");

            if ($sidebar_img_container.length != 0) {
                $sidebar_img_container.fadeOut("fast", function () {
                    $sidebar_img_container.css("background-image", 'url("' + new_image + '")');
                    $sidebar_img_container.fadeIn("fast");
                });
            }

            if ($full_page_background.length != 0) {
                $full_page_background.fadeOut("fast", function () {
                    $full_page_background.css("background-image", 'url("' + new_image + '")');
                    $full_page_background.fadeIn("fast");
                });
            }

            if ($sidebar_responsive.length != 0) {
                $sidebar_responsive.css("background-image", 'url("' + new_image + '")');
            }
        });
    }
    ngAfterViewInit() {
        this.runOnRouteChange();
    }
    isMaps(path) {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if (path == titlee) {
            return false;
        } else {
            return true;
        }
    }
    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
            //   const ps = new PerfectScrollbar(elemMainPanel);
            //   ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf("MAC") >= 0 || navigator.platform.toUpperCase().indexOf("IPAD") >= 0) {
            bool = true;
        }
        return bool;
    }

    public inputUserLogin: string = "";
    public inputUserPassword: string = "";
    
    public validatedLogin: boolean = false;
    public cadastrarUsuarioActive: boolean = false;
    public logadoTenant = false;

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
                this.cadastrarUsuarioActive = true;

                this.getTenant();
                this.router.navigate(['/cadastrar-usuarios'])
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
        if(this.tenantSelect !== ''){
            localStorage.setItem("tenant", this.tenantSelect);
            this.router.navigate(['/home']);

            this.cadastrarUsuarioActive = false;
            this.logadoTenant = true;
        }
    }
}
