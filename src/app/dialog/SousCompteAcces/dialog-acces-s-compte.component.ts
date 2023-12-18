import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SousReseauxService} from "../../service/SousReseauService/sous-reseaux.service";
import {UserService} from "../../service/UserService/user.service";
import {UserModel} from "../../model/user.model";
import {ReseauModel} from "../../model/reseau.model";
import {AuthService} from "../../service/authService/auth.service";
import {SousCompteModel} from "../../model/sousCompte.model";
import {SousCompteService} from "../../service/SousCompte/sous-compte.service";
import {AccesScompte} from "../../model/AccesScompte";
import {DialogAlertComponent} from "../SnackBar/dialog-alert.component";

@Component({
  selector: 'app-dialog-acces-reseau',
  templateUrl: './dialog-acces-s-compte.component.html',
  styleUrls: ['./dialog-acces-s-compte.component.scss']
})
export class DialogAccesSCompteComponent implements OnInit {

  title : string = "Ajout agent au reseau"
  Acces !: UserModel[];
  Reseau ?: ReseauModel[];
  SCompte !: SousCompteModel[];
  AccesScompte !: AccesScompte;
  ReseauAccessForm !: FormGroup;
  chooseAcces !: UserModel;
  chooseScompte !: SousCompteModel;
  actionBtn : string = "Sauvegarder"

  user !: UserModel[]
  scompte !: SousCompteModel;

  errorMessage: any;

  constructor(private formBuilder : FormBuilder ,
              private apiReseau: SousReseauxService ,
              private apiScompte: SousCompteService,
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

    this.apiScompte.getMySousComptes(this.authService.getId())
      .subscribe({
        next : (res) => {
          this.SCompte = res.data as SousCompteModel[]
        },
        error : (err) => {
          console.log(err.errorMessage)
        }
      })
    this.ReseauAccessForm = this.formBuilder.group({
      acces : ['',Validators.required],
      scompte : ['',Validators.required]
    })
  }
  addAccesToScompte(){
      if(this.ReseauAccessForm.valid){
        this.AccesScompte = this.ReseauAccessForm.value
        console.log(this.AccesScompte)
        this.apiScompte.affectAgent(this.AccesScompte)
          .subscribe({
            next : () => {
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: "Agent ajouter au sous compte avec success",
                duration: 2000,
                verticalPosition: "bottom",
                horizontalPosition: "end",
                panelClass: ["custom-style-add"]
              })
              this.ReseauAccessForm.reset();
              this.dialogRef.close('save');
            },
            error : (err) => {
              console.log(err)
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
  onChooseAcces() {
    let acces = this.ReseauAccessForm.controls['acces'].value as UserModel
    this.chooseAcces = this.Acces.find(x => x.id == acces.id)!
    this.checkAcces(this.chooseAcces, this.chooseScompte, this.SCompte);
  }
  onChooseScompte(){
    let scompte = this.ReseauAccessForm.controls['scompte'].value as SousCompteModel;
    this.chooseScompte = this.SCompte.find(x => x.id == scompte.id)!
    this.checkAcces(this.chooseAcces,this.chooseScompte, this.SCompte)
  }
  checkAcces(acces ?: UserModel, scompte ?: SousCompteModel, Scomptes ?: SousCompteModel[]){
    if(acces && scompte && Scomptes){
      Scomptes.forEach(scompte => {
        this.user = scompte.accesCollection.filter(x => x.id == acces.id).filter(x => x.roles?.code === 'OPERATEUR')
        if(this.user)
          this.scompte = scompte;
      })
      if(this.user[0] && this.scompte.id != scompte.id){
        console.log("l'operateur "+this.user[0].name+" est dans le sous compte "+ this.scompte.sousCompteName  )
        this.actionBtn = "Deplacer l'agent"
      }else
        this.actionBtn = "Sauvegarder"
    }
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
