import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import axios from "axios";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent {
    constructor(private router: Router) {}

    public inputUserLogin: string = "";
    public inputUserPassword: string = "";
    public validatedLogin: boolean = false;

    public cadastrarUsuarioActive: boolean = false;

    // public headers: { Authorization: string } = { Authorization: '' };
    public config: {} = {};

    public sendLogin = async () => {
        var logado: boolean = true;

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

            let sendInfo = await axios.post(url, loginObject);
            // console.log(sendInfo);

            if (sendInfo.data.success) {
                const token = "Bearer " + sendInfo.data.data.token;
                this.config = {
                    headers: { Authorization: token },
                };
                // console.log(this.config);
                localStorage.setItem("Authorization", token);

                this.validatedLogin = false;

                // this.headers = { Authorization: token };

                // this.sendConfig.emit(this.headers);
                // console.log(this.headers);

                // console.log(this.sendConfig.emit(this.headers));
            } else {
                if (sendInfo.data.data.error) {
                    // alert(sendInfo.data.data.error);
                } else {
                    // alert(sendInfo.data.data)
                    // console.log(sendInfo.data.data);
                }
            }

            let getInfo = await axios.get(url2, this.config);
            // this.router.navigate(['/table-list'], {
            //   state:{
            //     data: this.config
            //   }
            // });
            this.router.navigate(["/home"]);

            // console.log(getInfo);

            // if(getInfo.data.success){
            // 	console.log(getInfo.data.data);

            // }

            // axios
            //     .post(url, loginObject)
            //     .then((resp) => {
            //         //axios.post(url, loginObject).then(resp => {
            //         console.log('sucesso');
            //         const data = resp.data;

            //         console.log(data);

            //         if (data.success) {
            //             const token = 'Bearer ' + data.data.token;
            //             // alert(token);
            //             // headers = {'Authorization': 'Bearer '+ token};
            //             config = {
            //                 headers: { Authorization: token },
            //             };
            //             // headers: {'Authorization': 'Bearer '},

            //             //     this.pessoa.bairro = data.bairro
            //             //     this.pessoa.rua = data.logradouro
            //             //     this.pessoa.cidade = data.localidade
            //             //     this.pessoa.uf = data.uf
            //             logado = true;
            // 			console.log(logado);
            // 			if (logado) {
            // 				console.log(config);
            // 				axios.get(url2, config).then((resp) => {
            // 					console.log(resp);
            // 				});
            // 			}

            //         } else {
            //             alert(data.data.error);
            //         }
            //     })
            //     .catch((error) => {
            //         console.log('erro');

            //         console.error(error);
            //     });
            // let sedData = async () =>{

            // }
        }
        return;
    };

    public mostrarCadastrarUsuario() {
        this.cadastrarUsuarioActive = true;
    }
}
