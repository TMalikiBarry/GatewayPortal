import {Component, Inject, OnInit} from '@angular/core';
import {UserModel} from "../../model/user.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogAlertComponent} from "../SnackBar/dialog-alert.component";
import {ReseauxService} from "../../service/reseauService/reseaux.service";

export const  Categorie = [
  "B2B",
  "GROSSISTE",
  "INDEPENDANT"
]

@Component({
  selector: 'app-dialog-reseaux',
  templateUrl: './dialog-reseaux.component.html',
  styleUrls: ['./dialog-reseaux.component.scss']
})
export class DialogReseauxComponent implements OnInit {

  options = Categorie;
  Reseau !: UserModel;
  ReseauForm !: FormGroup;
  actionBtn : string = "Sauvegarder"
  errorMessage: any;

  constructor(private formBuilder : FormBuilder ,
              private api : ReseauxService ,
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogAlert : MatDialog,
              private _snackBar : MatSnackBar,
              private dialogRef : MatDialogRef<DialogReseauxComponent>) { }

  ngOnInit(): void {
    this.ReseauForm = this.formBuilder.group({
      id : [''],
      name : ['',[Validators.required, Validators.minLength(3)]],
      code : ['',[Validators.required, Validators.minLength(2)]],
      categorie : [''],
    })

    if(this.editData){
      this.actionBtn = "Mettre a jour"
      this.ReseauForm.controls['id'].setValue(this.editData.id)
      this.ReseauForm.controls['name'].setValue(this.editData.name)
      this.ReseauForm.controls['code'].setValue(this.editData.code)
      this.ReseauForm.controls['categorie'].setValue(this.editData.categorie)
      console.log(this.editData)
    }
  }
  addReseau(){
    if(!this.editData){
      if(this.ReseauForm.valid){
        this.Reseau = this.ReseauForm.value
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
              this.dialogRef.close('save');
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
