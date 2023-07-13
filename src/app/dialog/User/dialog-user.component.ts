import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserModel} from "../../model/user.model";
import {DialogAlertComponent} from "../SnackBar/dialog-alert.component";
import {RoleModel} from "../../model/role.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../service/UserService/user.service";
import {ProfilService} from "../../service/profilService/profil.service";

export const RoleModelCommercant : RoleModel[] = [
  {
    id : 1,
    name : "Superviseur",
    code : "SUPERVISEUR",
  },
  {
    id : 2,
    name : "Operateur",
    code : "OPERATEUR",
  }
]

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {

  options : RoleModel[] = [];
  optionsCommercant = RoleModelCommercant;
  User !: UserModel;
  sousReseauForm !: FormGroup;
  actionBtn : string = "Sauvegarder"
  roles : RoleModel[] = [];
  //phonePattern = /^(7[0-9])\s(\d{3})\s(\d{2})\s(\d{2})$/;
  rolesApi !: RoleModel[];
  code : String | undefined;
  title : string = "Ajout Agent"

  constructor(private formBuilder : FormBuilder ,
              private api : UserService ,
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogAlert : MatDialog,
              private _snackBar : MatSnackBar,
              private apiProfil : ProfilService,
              private dialogRef : MatDialogRef<DialogUserComponent>) { }

  ngOnInit(): void {
    // TODO a revoir
    this.apiProfil.getAllRole().subscribe({
      next : (res) => {
        this.rolesApi = res.data as RoleModel[];
        this.rolesApi.forEach(roleCom => {
          this.optionsCommercant.forEach(roleCom1 => {
            if(roleCom.code.indexOf(roleCom1.code) !== -1){
              this.options.push(roleCom)
              console.log(this.options)
            }
          })
        })
      }
    })
    this.sousReseauForm = this.formBuilder.group({
      id : [''],
      name : ['',[Validators.required, Validators.minLength(3)]],
      number : ['',[Validators.required, Validators.minLength(9)]],
      email : ['',[Validators.required, Validators.minLength(8)]],
      username : ['',[Validators.required, Validators.minLength(3)]],
      password : [''],
      roles : [[]],
      idParent : ['']
    })

    if(this.editData){
      this.title = "Modifier Agent"
      this.actionBtn = "Mettre a jour"
      this.sousReseauForm.controls['id'].setValue(this.editData.id)
      this.sousReseauForm.controls['username'].setValue(this.editData.username)
      this.sousReseauForm.controls['roles'].setValue(this.editData.roles[0].name)
      this.sousReseauForm.controls['email'].setValue(this.editData.email)
      this.sousReseauForm.controls['number'].setValue(this.editData.number)
      this.sousReseauForm.controls['name'].setValue(this.editData.name)
      this.sousReseauForm.controls['idParent'].setValue(this.editData.idParent)
      this.sousReseauForm.controls['password'].setValue(this.editData.password)
      console.log(this.editData)
    }
  }
  addUser(){
    if(!this.editData){
      if(this.sousReseauForm.valid){
        this.User = this.sousReseauForm.value
        this.roles.push(this.options?.find(x => x.name === this.sousReseauForm.controls['roles'].value) as RoleModel)
        // if (!this.roles) {
        //   this._snackBar.openFromComponent(DialogAlertComponent, {
        //     data: "Le role spécifié n'est pas autorisé ici",
        //     duration: 2500,
        //     verticalPosition: "top",
        //     horizontalPosition: "center",
        //     panelClass: ["custom-style-delete"]
        //   });
        //   return;
        // }
        this.User.roles = this.roles
        console.log(this.User)
        this.api.postUser(this.User)
          .subscribe({
            next:()=>{
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: "Utilisateur ajouter avec Success",
                duration: 2000,
                verticalPosition: "bottom",
                horizontalPosition: "end",
                panelClass: ["custom-style-add"]
              })
              this.sousReseauForm.reset();
              this.dialogRef.close('save');
            },
            error:()=>{
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: "Veillez verifier le formulaire",
                duration: 2000,
                verticalPosition: "top",
                horizontalPosition: "end",
                panelClass: ["custom-style-delete"]
              })
            }
          })
       }
    }else{
      this.updateUser()
    }
  }
  updateUser(){
    if(this.sousReseauForm.valid){
      this.User = this.sousReseauForm.value
      this.roles.push(this.options?.find(x => x.name === this.sousReseauForm.controls['roles'].value) as RoleModel);
      // if (!this.roles) {
      //   this._snackBar.openFromComponent(DialogAlertComponent, {
      //     data: "Lrole spécifié n'est pas autorisé ici",
      //     duration: 2500,
      //     verticalPosition: "top",
      //     horizontalPosition: "center",
      //     panelClass: ["custom-style-delete"]
      //   });
      //   return;
      // }
      this.User.roles = this.roles
      console.log(this.User)
      this.api.putUser(this.User, this.editData.id)
        .subscribe({
          next : ()=>{
            this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Utilisateur Mis a jour avec Success",
              duration: 2000,
              verticalPosition: "bottom",
              horizontalPosition: "end",
              panelClass: ["custom-style-update"]
            })
            this.sousReseauForm.reset();
            this.dialogRef.close('update')
          },
          error : ()=>{
            this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Veillez verifier le formulaire",
              duration: 2000,
              verticalPosition: "top",
              horizontalPosition: "end",
              panelClass: ["custom-style-delete"]
            })
          }
        })
    }
  }

  getErrorMessage( errors : ValidationErrors){
    if(errors['required']){
      return 'Champs Obligatoire'
    }else if(errors['minlength']){
      return 'Champs doit contenir au minimum '+errors['minlength']['requiredLength']+' caracteres'
    }else if (errors['pattern']) {
      return 'Renseignez en respectant le bon format #76 654 54 54';
    }else{
      return ""
    }
  }
}
