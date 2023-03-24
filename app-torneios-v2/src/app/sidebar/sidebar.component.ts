import { Component, OnInit } from "@angular/core";
import PerfectScrollbar from "perfect-scrollbar";
import { ControllerComponent, ROUTES } from "../controller/controller.component";

declare const $: any;

@Component({
    selector: "app-sidebar-cmp",
    templateUrl: "sidebar.component.html",
})
export class SidebarComponent extends ControllerComponent implements OnInit {
    public getToken = localStorage.getItem("Authorization");
    public userId = localStorage.getItem("Id");
    public headers = { Authorization: this.getToken, "Content-Type": "application/json" };
    public setToken: any = { headers: this.headers };
    public userInfo = {};
    public menuItems: any[];
    public userInicial= '';

    ps: any;
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    async ngOnInit() {
        await this.getMenu();
        this.menuItems = this.entries.filter((menuItem) => menuItem);
                
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector(".sidebar .sidebar-wrapper");
            this.ps = new PerfectScrollbar(elemSidebar);
        }
        const path = '/user/'+this.userId;
        let info = await this.getInfo(path, this.setToken);
        this.userInfo = info.data.data.nm_usuario;        
        this.userInicial= this.userInfo[0].toLowerCase();
        
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function(value, key) {
            if(value.classList.contains('active')){
                let navChild = value.lastElementChild;
                if(navChild.classList.contains('collapse')){
                    navChild.classList.add('show');
                }
                else{
                    navChild.classList.remove('show');
                }
            }
        });
    }

    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf("MAC") >= 0 || navigator.platform.toUpperCase().indexOf("IPAD") >= 0) {
            bool = true;
        }
        return bool;
    }

    public async getMenu() {
        const formData = new FormData();
        formData.append('tipo_request', 'listaOpcoes');
        formData.append('id_usuario', '8');
        let listaMenuUsuario = await this.postInfo(this.paths.geral, formData, this.setToken);
        this.listaMenu = listaMenuUsuario;

        console.log('lista back');
        console.log(this.listaMenu);

        this.entries = Object.values(this.listaMenu);
        console.log('lista front');
        console.log(this.entries);
    }
}
