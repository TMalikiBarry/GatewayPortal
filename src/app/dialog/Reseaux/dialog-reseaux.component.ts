import {Component, Inject, OnInit} from '@angular/core';
import {UserModel} from "../../model/user.model";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogAlertComponent} from "../SnackBar/dialog-alert.component";
import {ReseauxService} from "../../service/reseauService/reseaux.service";
import {ReseauModel} from "../../model/reseau.model";
import {AuthService} from "../../service/authService/auth.service";
import {UserService} from "../../service/UserService/user.service";
import {ReseauAccesModel} from "../../model/reseau.acces.model";
import {RoleModel} from "../../model/role.model";

export const  Categorie = [
  "B2B",
  "GROSSISTE",
  "INDEPENDANT"
]
export class AccesReseau {
  username ?: string
  reseau ?: string
}

@Component({
  selector: 'app-dialog-reseaux',
  templateUrl: './dialog-reseaux.component.html',
  styleUrls: ['./dialog-reseaux.component.scss']
})
export class DialogReseauxComponent implements OnInit {

  title : string = "Ajout Reseau"
  valueUser : UserModel[] = [];
  options = Categorie;
  Reseau !: ReseauModel;
  User : UserModel[] = [];
  ReseauForm !: FormGroup;
  actionBtn : string = "Sauvegarder"
  errorMessage: any;
  accesList : UserModel[] = [];

  constructor(private formBuilder : FormBuilder ,
              private api : ReseauxService ,
              private apiUser : UserService ,
              private auth : AuthService,
              @Inject(MAT_DIALOG_DATA) public editData : ReseauModel,
              private dialogAlert : MatDialog,
              private _snackBar : MatSnackBar,
              private dialogRef : MatDialogRef<DialogReseauxComponent>) { }

  ngOnInit(): void {
    this.ReseauForm = this.formBuilder.group({
      id : [''],
      name : ['',[Validators.required, Validators.minLength(3)]],
      code : ['',[Validators.required, Validators.minLength(2)]],
      accesCollection : [[]]
    })
    this.apiUser.getUser(this.auth.getId()).subscribe({
      next : (res => {
        this.User = res.data as UserModel[] ;
        console.log(this.User)
      })
    })
    this.apiUser.getAllUser(this.auth.getId()).subscribe({
          next : (res => {
            this.accesList = res.data as UserModel[] ;
            if(this.editData){
              this.accesList.forEach(a => {
                this.editData.accesCollection.forEach(b => {
                  if(a.id !== this.auth.getId() && a.id === b.id){
                    this.valueUser.push(a)
                    console.log(a)
                  }
                })
              })
            }
           })
        })

    if(this.editData){
      this.title = "Modifier Reseau"
      this.actionBtn = "Mettre a jour"
      this.ReseauForm.controls['id'].setValue(this.editData.id)
      this.ReseauForm.controls['name'].setValue(this.editData.name)
      this.ReseauForm.controls['code'].setValue(this.editData.code)
      this.ReseauForm.controls['accesCollection'].setValue(this.valueUser)
    }
  }
  filter(data : any){
    this.valueUser = data.value
    console.log(this.valueUser)
  }

  addReseau(){
    if(!this.editData){
      if(this.ReseauForm.valid){
        this.Reseau = this.ReseauForm.value
        this.Reseau.accesCollection.push(this.User as unknown as UserModel);
        console.log(this.Reseau)
        this.api.postReseau(this.Reseau)
          .subscribe({
            next:(res)=>{
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: "Reseau ajouter avec Success",
                duration: 2000,
                verticalPosition: "bottom",
                horizontalPosition: "end",
                panelClass: ["custom-style-add"]
              })
              this.ReseauForm.reset();
              this.dialogRef.close('save')
            },
            error:(err)=>{
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
      this.updateReseau()
    }
  }
  updateReseau(){
    if(this.ReseauForm.valid){
      this.Reseau = this.ReseauForm.value
      this.Reseau.accesCollection.push(this.User as unknown as UserModel);
      this.api.putReseau(this.Reseau, this.editData.id)
        .subscribe({
          next : (res)=>{
            this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Reseau Mis a jour avec Success",
              duration: 2000,
              verticalPosition: "bottom",
              horizontalPosition: "end",
              panelClass: ["custom-style-update"]
            })
            this.ReseauForm.reset();
            this.dialogRef.close('update')
          },
          error : (err)=>{
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
    }else{
      return ""
    }
  }
}
