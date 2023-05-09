import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SousReseauxService} from "../../service/SousReseauService/sous-reseaux.service";
import {UserService} from "../../service/UserService/user.service";
import {UserModel} from "../../model/user.model";
import {ReseauModel} from "../../model/reseau.model";
import {AuthService} from "../../service/authService/auth.service";
import {ReseauAccesModel} from "../../model/reseau.acces.model";

@Component({
  selector: 'app-dialog-acces-reseau',
  templateUrl: './dialog-acces-s-compte.component.html',
  styleUrls: ['./dialog-acces-s-compte.component.scss']
})
export class DialogAccesSCompteComponent implements OnInit {

  title : string = "Ajout agent au reseau"
  Acces !: UserModel[];
  Reseau ?: ReseauModel[];
  ReseauAcces ?: ReseauAccesModel[];
  ReseauAccessForm !: FormGroup;
  actionBtn : string = "Sauvegarder"

  errorMessage: any;

  constructor(private formBuilder : FormBuilder ,
              private apiReseau: SousReseauxService ,
              private apiAcces: UserService ,
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogAlert : MatDialog,
              private authService : AuthService,
              private _snackBar: MatSnackBar,
              private dialogRef : MatDialogRef<DialogAccesSCompteComponent>) { }

  ngOnInit(): void {
    this.apiAcces.getAllUser(this.authService.getId())
      .subscribe({
        next: (res) => {
          this.Acces = res.data as UserModel[]
        },
        error:()=>{
          alert("Erreur sur la recuperation des Agents")
        }
      })
    this.apiReseau.getMySousReseaux()
      .subscribe({
        next: (res) => {
          this.Reseau = res.data as ReseauModel[]
        },
        error:()=>{
          alert("Erreur sur la recuperation des Sous-Reseaux")
        }
      })
    this.ReseauAccessForm = this.formBuilder.group({
      username : ['',Validators.required],
      reseau : ['',Validators.required]
    })
  }
  addAccesToReseau(){
/*
    if(!this.editData){
      if(this.ReseauAccessForm.valid){
        this.ReseauAcces = this.ReseauAccessForm.value
        console.log(this.ReseauAcces)
        this.apiReseau.postSousReseau(this.ReseauAcces)
          .subscribe({
            next:()=>{
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: "Agent ajouter au reseau avec success",
                duration: 2000,
                verticalPosition: "bottom",
                horizontalPosition: "end",
                panelClass: ["custom-style-add"]
              })
              this.ReseauAccessForm.reset();
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
     }
*/
  }

  getErrorMessage( errors : ValidationErrors){
    if(errors['required']){
      return 'Champs Obligatoire'
    }else if(errors['minlength']){
      return 'Champs doit contenir au minimum '+errors['minlength']['requiredLength']+' caracteres'
    } else{
      return ""
    }
  }

}
