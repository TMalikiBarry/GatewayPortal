import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserModel} from "../model/user.model";
import {ResetRequest} from "../request/ResetRequest";
import {ReinitModel} from "../model/reinit.model";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {AuthService} from "../service/authService/auth.service";
import {UserService} from "../service/UserService/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogAlertComponent} from "../dialog/SnackBar/dialog-alert.component";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  resetForm !: FormGroup;
  emaillab : boolean = false;
  urltoken !: string | null ;
  user !: UserModel[];
  token : boolean = false;
  errorMessage : any;
  title : string = "Reinitialisation Mot de Passe"
  bouton : string = "Reinitialiser"
  model !: ReinitModel
  request !: ResetRequest;

  hide : boolean = true ;
  constructor(private dialog : MatDialog,
              private formBuilder : FormBuilder,
              private api : AuthService,
              private apiUser : UserService,
              private activated : ActivatedRoute,
              private router : Router,
              @Inject(MAT_DIALOG_DATA) public login : any,
              private _snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.urltoken = this.activated.snapshot.queryParamMap.get('token');
    if(this.urltoken){
      this.api.confirm(this.urltoken).subscribe({
        next : value => {
          this.user = value.data as UserModel[]
          console.log(this.user)
          if(!value.data){
            this.router.navigate(['login']);
            this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Token expirer",
              duration: 4000,
              verticalPosition: "top",
              horizontalPosition: "end",
              panelClass: ["custom-style-delete"]
            })
          }
        },
        error : err => {
          console.log(err)
          this.router.navigate(['login']);
          this._snackBar.openFromComponent(DialogAlertComponent, {
            data: "Token invalid",
            duration: 4000,
            verticalPosition: "top",
            horizontalPosition: "end",
            panelClass: ["custom-style-delete"]
          })
        }
      })
    }
    console.log(this.login.id)
    console.log('token '+this.activated.snapshot.queryParamMap.get('token'))
    if(localStorage.getItem("TOKEN") || this.urltoken){
      this.token = true;
    }
    console.log(this.api.isAuth)
    this.resetForm = this.formBuilder.group({
      email : [''],
      oldPassword : [''],
      password : [''],
      confirm : ['']
    })
    if (this.api.isLoggedIn() && !this.login.id){
      this.api.routingAlreadyConnectedApp();
    }
    if(!this.token){
      this.title  = "Mot de Passe Oublié"
      this.bouton = "Envoyer le lien"
      this.emaillab = true;
      this.resetForm.controls['email'].setValidators( [Validators.required, Validators.email])
    }else if(this.token && this.login.id){
      console.log(this.token + " "+ this.login.id)
      this.title = "Modifier Mot de Passe"
      this.bouton = "Modifier"
      this.resetForm.controls['oldPassword'].setValidators([Validators.required, Validators.minLength(5)])
      this.resetForm.controls['password'].setValidators([Validators.required, Validators.minLength(5)])
      this.resetForm.controls['confirm'].setValidators([Validators.required, Validators.minLength(5)])
    }else if(this.token){
      this.resetForm.controls['password'].setValidators([Validators.required, Validators.minLength(5)])
      this.resetForm.controls['confirm'].setValidators([Validators.required, Validators.minLength(5)])
    }
  }

  Reset() {
    if(this.resetForm.valid && this.resetForm.value.password === this.resetForm.value.confirm) {
      if (!this.emaillab && this.token) {
        let id
        if (this.api.currentUserValue) {
          id = this.api.currentUserValue.id;
        }
        if(this.token){
          if(this.resetForm.value.password === this.resetForm.value.oldPassword || this.resetForm.value.password === "00000000"){
            this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Veillez choisir un mot de passe different de l'ancien",
              duration: 3000,
              verticalPosition: "top",
              horizontalPosition: "end",
              panelClass: ["custom-style-delete"]
            })
            return
          }
        }
        this.api.reset(id, this.urltoken, this.resetForm.value.password, this.resetForm.value.oldPassword, this.resetForm.value.confirm)
          .subscribe({
            next: (user) => {
              this.dialog.closeAll()
              this.api.logout()
              this.router.navigateByUrl("/")
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: 'Mot de passe reinitialiser avec success',
                duration: 2000,
                verticalPosition: "top",
                horizontalPosition: "end",
                panelClass: ["custom-style-add"]
              })
            },
            error: (err) => {
              console.log(err)
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: "Mot de passe incorrect",
                duration: 5000,
                verticalPosition: "top",
                horizontalPosition: "end",
                panelClass: ["custom-style-delete"]
              })
            }
          })
      } else {
        // email
        this.request = this.resetForm.value
        this.request.local = 'commercant'
        console.log(this.request)
        this.api.forgot(this.request).subscribe({
          next: value => {
            this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Votre lien de reinitialisation a ete envoyer avec success",
              duration: 10000,
              verticalPosition: "top",
              horizontalPosition: "end",
              panelClass: ["custom-style-add"]
            })
          }
        })
      }
    }else{
      this._snackBar.openFromComponent(DialogAlertComponent, {
        data: "Veillez saisir le meme mot de passe",
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "end",
        panelClass: ["custom-style-delete"]
      })
    }
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
