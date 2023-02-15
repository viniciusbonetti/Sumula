import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/home', title: 'Home',  icon: 'home', class: '' },
    { path: '/user-profile', title: 'Usuario',  icon:'person', class: '' },
    { path: '/atleta', title: 'Atleta',  icon:'person', class: '' },
    { path: '/table-list', title: 'Eventos',  icon:'content_paste', class: '' },
    { path: '/cargos-cco', title: 'CCO',  icon:'content_paste', class: '' },
    { path: '/modalidade', title: 'Modalidades',  icon:'content_paste', class: '' },
    { path: '/delegacao', title: 'Delegação',  icon:'content_paste', class: '' },
    { path: '/tenant-usuario', title: 'Tenant usuarios',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
