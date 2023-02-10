import { Routes } from '@angular/router';

// import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { CadastrarUsuariosComponent } from 'app/cadastrar-usuarios/cadastrar-usuarios.component';
import { AtletaComponent } from 'app/atleta/atleta.component';
import { ListaAtletaComponent } from 'app/lista-atleta/lista-atleta.component';
import { CargosCcoComponent } from 'app/cargos-cco/cargos-cco.component';
import { ModalidadesComponent } from 'app/modalidades/modalidades.component';
import { DelegacaoComponent } from 'app/delegacao/delegacao.component';
import { TenantUsuarioComponent } from 'app/tenant-usuario/tenant-usuario.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    // { path: 'login',      component: LoginComponent },
    { path: 'cadastrar-usuarios',       component: CadastrarUsuariosComponent },
    { path: 'home',                     component: DashboardComponent },
    { path: 'user-profile',             component: UserProfileComponent },
    { path: 'atleta',                   component: AtletaComponent },
    { path: 'lista-atleta',             component: ListaAtletaComponent },
    { path: 'table-list',               component: TableListComponent },
    { path: 'cargos-cco',               component: CargosCcoComponent },
    { path: 'modalidade',               component: ModalidadesComponent },
    { path: 'delegacao',                component: DelegacaoComponent },
    { path: 'tenant-usuario',           component: TenantUsuarioComponent },
    { path: 'typography',               component: TypographyComponent },
    { path: 'icons',                    component: IconsComponent },
    { path: 'maps',                     component: MapsComponent },
    { path: 'notifications',            component: NotificationsComponent },
    { path: 'upgrade',                  component: UpgradeComponent },
];
