import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../service/authService/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogAlertComponent} from "../dialog/SnackBar/dialog-alert.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  errorMessage : any;
  hide : boolean = true ;
  constructor(private dialog : MatDialog, private formBuilder : FormBuilder, private api : AuthService , private router : Router, private _snackBar : MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.api.isAuth);
    this.loginForm = this.formBuilder.group({
      username : ['', [Validators.required, Validators.minLength(3)] ],
      password : ['', [Validators.required, Validators.minLength(5)] ]
    })
    if (this.api.isLoggedIn()){
      this.api.routingAlreadyConnectedApp();
    }
  }

  Login() {
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    this.api.login(username,password)
      .subscribe({
        next : (user) => {
          this.api.AuthentificateUser(user).subscribe({
            next : (data) => {
              console.log("data "+data)
              if(this.api.currentUserValue){
                console.log("login.ts "+this.api.currentUserValue.roles)
                this.router.navigate(['admin/dashboard']);
                this._snackBar.openFromComponent(DialogAlertComponent, {
                  data: `Bienvenue dans votre espace, ${user.username}` ,
                  duration: 2000,
                  verticalPosition: "top",
                  horizontalPosition: "end",
                  panelClass: ["custom-style-add"]
                })
              }
            }
          })
        },
        error : (err) => {
          if (err.status === 0) {
            this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Problème de connextion au serveur",
              duration: 5000,
              verticalPosition: "top",
              horizontalPosition: "end",
              panelClass: ["custom-style-delete"]
            });
            return;
          }
          this._snackBar.openFromComponent(DialogAlertComponent, {
            data: "Identifiant ou mot de passe incorrect",
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "end",
            panelClass: ["custom-style-delete"]
          });
          console.error(err);
        }
      })
  }

  getErrorMessage( errors : ValidationErrors){
    if(errors['required']){
      return 'Champs Obligatoire'
    }else if(errors['minlength']){
      return 'Champs doit contenir au minimum '+errors['minlength']['requiredLength']+' caracteres'
    }else{
      return ""
    }
  }

}
