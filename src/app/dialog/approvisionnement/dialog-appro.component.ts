import {Component, Inject, OnInit} from '@angular/core';
import {CompteModel} from "../../model/compte.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {TypeFiles} from "../../model/type-files";
import {ApprovisionnementService} from "../../service/ApprovisionnementService/approvisionnement.service";
import {DemandeApproModel} from "../../model/demandeAppro.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DossierService} from "../../service/DossierService/dossier.service";
import {EStatutDossier} from "../../model/EStatutDossier";
import {CompteService} from "../../service/CompteService/compte.service";
import {AuthService} from "../../service/authService/auth.service";
import {DialogAlertComponent} from "../SnackBar/dialog-alert.component";
import {EStatutDemande} from "../../model/EStatutDemande";
import {map} from "rxjs/operators";
import {CurrencyPipe} from "@angular/common";

export type FileType = 'evidence';

@Component({
  selector: 'app-dialog-appro',
  templateUrl: './dialog-appro.component.html',
  styleUrls: ['./dialog-appro.component.scss']
})
export class DialogApproComponent implements OnInit {
  title : string = "Approvisionnement"
  Appro !: DemandeApproModel;
  Compte !: CompteModel;
  ApproForm !: FormGroup;
  fileNameMap = new Map();
  typeFile = TypeFiles;
  evidence_R : string | ArrayBuffer | null = 'assets/Blanc.png'
  actionBtn : string = "Sauvegarder"
  fileName !: string;

  errorMessage: any;

  constructor(private formBuilder : FormBuilder ,
              private currencyPipe: CurrencyPipe,
              private api: ApprovisionnementService ,
              private apiCompte : CompteService,
              private auth : AuthService,
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogAlert : MatDialog,
              private _snackBar: MatSnackBar,
              private apiDossier : DossierService,
              private dialogRef : MatDialogRef<DialogApproComponent>) { }

  ngOnInit(): void {

    this.apiCompte.getMyCompte(this.auth.getId()).pipe(
      map(res => res.data as CompteModel[]),
    ).subscribe(comptes => {
      this.Compte = comptes.find(compte => compte.natureCompte === 'PRINCIPAL') || comptes[0];
      console.log(this.Compte)
    })

    this.ApproForm = this.formBuilder.group({
      id : [''],
      montant : ['',[Validators.required]],
      evidence : ['',Validators.required]
    })

  }
  addAppro(){
      if(this.ApproForm.valid){
        this.Appro = this.ApproForm.value
        this.Appro.compte = this.Compte
        this.Appro.dateDemande = new Date();
        this.Appro.statutDemande = EStatutDemande.PENDING
        if (this.Appro.evidence) {
          this.Appro.evidence = {
            statut: EStatutDossier.PENDING,
            uploadingFile: "",
            commentaire: "",
            name: this.fileName,
            acces : this.Appro.compte.acces! ,
            typeFile: TypeFiles.evidence  // Remplacez par la valeur appropriée
          };
        }
        this.Appro.evidence.acces = this.Appro.compte?.acces
        console.log(this.Appro)
        this.api.postAppro(this.Appro)
          .subscribe({
            next:(res)=>{
              this._snackBar.openFromComponent(DialogAlertComponent, {
                data: "Demande Approvisionnement effectuer avec Success",
                duration: 2000,
                verticalPosition: "bottom",
                horizontalPosition: "end",
                panelClass: ["custom-style-add"]
              })
              this.ApproForm.reset();
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
  }
  // updateSCompte(){
  //   if(this.PaysForm.valid){
  //     this.Pays = this.PaysForm.value
  //     this.Pays.zone = this.Zones?.find(x => x.id === this.PaysForm.controls['zone'].value)
  //     console.log(this.Pays)
  //     this.apiPays.putPays(this.PaysForm.value, this.editData.id)
  //       .subscribe({
  //         next : (res)=>{
  //           this.utils.snackBar("Pays mis a jour avec success",2000,"UPDATE")
  //           this.PaysForm.reset();
  //           this.dialogRef.close('update')
  //         },
  //         error : (err)=>{
  //           this.utils.snackBar("Veillez verifier le formulaire",2000,"DELETE")
  //         }
  //       })
  //   }
  // }

  onFileSelected(event: any, typeFile: TypeFiles) {
    const file: File = event.target.files[0];

    let formCon = ''
    let reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        if(typeFile == TypeFiles.evidence){
          this.evidence_R = event.target.result
          formCon = 'evidence'
        }
      }
    }

    reader.readAsDataURL(file);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      this.apiDossier.Upload(formData, typeFile).subscribe({
        next: (res => {
          console.log(res.data);
          let name = res.data as unknown as string
          this.fileName = name
          this.fileNameMap.set(this.getEnumVariable(typeFile), res.data);
          this.ApproForm.controls[formCon].setValue(typeFile + '_' + file.name);
          this.Appro = this.ApproForm.value
          if (this.Appro.evidence && this.Compte) {
            this.Appro.evidence = {
              statut: EStatutDossier.APPROVISIONNEMENT,
              uploadingFile: "",
              commentaire: "",
              name: name,
              acces : this.Compte.acces! ,
              typeFile: TypeFiles.evidence  // Remplacez par la valeur appropriée
            };
          }
          console.log(this.Appro)
        })
      })
    }
  }

  formatMontant() {
    console.log("format")
    let montant = this.ApproForm.controls['montant'].value;
    this.currencyPipe.transform(montant,'XOF','symbol' );
    //this.montant = parseFloat(this.montant.toString().replace(',', '.')); // Remplacez la virgule par le point décimal si nécessaire
    //this.montant = Math.round(this.montant * 100) / 100; // Arrondi à deux décimales
    this.ApproForm.controls['montant'].setValue(montant);
  }
  getEnumVariable(type: TypeFiles) {
    return <FileType>Object.keys(TypeFiles).find(key => TypeFiles[key as FileType] === type)
  }

  deleteFile(nameFile: string, key: FileType) {
    this.apiDossier.removeFile(nameFile).subscribe(
      ()=> {
        this.fileNameMap.delete(key);
        this.ApproForm.controls[key].setValue('');
      }
    )
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
