import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { CadastrarUsuariosComponent } from './cadastrar-usuarios/cadastrar-usuarios.component';
import { AtletaComponent } from './atleta/atleta.component';
import { ListaAtletaComponent } from './lista-atleta/lista-atleta.component';
import { CargosCcoComponent } from './cargos-cco/cargos-cco.component';
import { ModalidadesComponent } from './modalidades/modalidades.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { DelegacaoComponent } from './delegacao/delegacao.component';
import { TenantUsuarioComponent } from './tenant-usuario/tenant-usuario.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AdminLayoutModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    CadastrarUsuariosComponent,
    ListaAtletaComponent,
    CargosCcoComponent,
    ModalidadesComponent,
    DelegacaoComponent,
    TenantUsuarioComponent

  ],
  exports: [
    CadastrarUsuariosComponent,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
