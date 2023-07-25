import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {ControlTransactionService} from "../../service/controlTransaction/control-transaction.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ControlTransactionInterface} from "../../model/control-transaction.interface";
import {NotifyService} from "../../service/utils/notify.service";
import {ServiceModel} from "../../model/service.model";
import {Observable, tap} from "rxjs";
import {UserModel} from "../../model/user.model";
import {map} from "rxjs/operators";
import {AVAILABLE_SERVICES} from "../../../assets/List-Service-Dispo/Available_Services";
import {PointsInterface} from "../../model/points.interface";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-dialog-control-trans',
  templateUrl: './dialog-control-trans.component.html',
  styleUrls: ['./dialog-control-trans.component.scss']
})
export class DialogControlTransComponent implements OnInit {

  title: string = "Ajouter un";
  actionBtn: string = "ENREGISTRER";

  listPoints!: PointsInterface[];
  chosenPoint!: PointsInterface;

  listServices$!: Observable<ServiceModel[]>;
  chosenService!: ServiceModel;

  montantSeuil !: string | null
  montantJournalier !: string | null
  montantHebdomadaire !: string | null

  cTransacForm = this.fb.group({
    service: ['', Validators.required],
    point: ['', Validators.required],
    // montantSeuil: ['', [Validators.required, Validators.pattern("^[1-9]*[05]+$")]],
    // montantHebdomadaire: ['', [Validators.pattern("^[1-9]*[05]+$")]],
    // montantJournalier: ['', Validators.pattern("^[1-9]*[05]+$")],
    montantSeuil : ['', Validators.required],
    montantHebdomadaire : [''],
    montantJournalier : [''],
    heureDebut: ['',Validators.required],
    heureFin: ['', Validators.required],
  })

  constructor(private fb: FormBuilder,
              private currencyPipe: CurrencyPipe,
              private api: ControlTransactionService,
              @Inject(MAT_DIALOG_DATA) public editData: ControlTransactionInterface,
              private notify: NotifyService,
              private dialogRef: MatDialogRef<DialogControlTransComponent>) {
  }

  ngOnInit(): void {
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.api.getMyPoints(myId).subscribe(
      res => {
        this.listPoints = res.data as PointsInterface[];
      }
    );
    this.listServices$ = this.api.getAllService().pipe(
      map(res => res.data as ServiceModel[]),
      map(services => services.filter(service => AVAILABLE_SERVICES.includes(service.serviceName)))
    );

    if (this.editData) {
      this.title = "Modifier le";
      this.actionBtn = "Mettre à jour"

      this.chosenPoint = this.editData.point;
      this.chosenService = this.editData.service;
      // Ajouter "// @ts-ignore" pour résoudre le probleme pour le moment
      // @ts-ignore
      this.cTransacForm.controls['service'].setValue(this.editData.service.id);
      // Ajouter "// @ts-ignore" pour résoudre le probleme pour le moment
      // @ts-ignore
      this.cTransacForm.controls['point'].setValue(this.editData.point.id!);
      this.montantSeuil = this.currencyPipe.transform(this.editData.montantSeuil.toString(),'XOF','symbol')
      this.montantJournalier = this.currencyPipe.transform(this.editData.montantJournalier!.toString(), 'XOF','symbol')
      this.montantHebdomadaire = this.currencyPipe.transform(this.editData.montantHebdomadaire!.toString(), 'XOF','symbol')
      // this.cTransacForm.controls['montantSeuil'].setValue(this.currencyPipe.transform(this.editData.montantSeuil.toString(),'XOF','symbol' ));
      // this.cTransacForm.controls['montantJournalier'].setValue(this.currencyPipe.transform(this.editData.montantJournalier!.toString(),'XOF','symbol' ));
      // this.cTransacForm.controls['montantHebdomadaire'].setValue(this.currencyPipe.transform(this.editData.montantHebdomadaire!.toString(), 'XOF','symbol'));
      this.cTransacForm.controls['heureDebut'].setValue(this.editData.heureDebut!.toString());
      this.cTransacForm.controls['heureFin'].setValue(this.editData.heureFin!);
    }
  }

  formatMontantSeuil() {
    //this.montantSeuil = parseFloat(this.montant.toString().replace(',', '.')); // Remplacez la virgule par le point décimal si nécessaire
    //this.montantSeuil = Math.round(this.montant * 100) / 100; // Arrondi à deux décimales
    this.montantSeuil = this.currencyPipe.transform(this.montantSeuil,'XOF','symbol' );
  }
  formatMontantHebdomadaire() {
    //this.montantHebdomadaire = parseFloat(this.montant.toString().replace(',', '.')); // Remplacez la virgule par le point décimal si nécessaire
    //this.montantHebdomadaire = Math.round(this.montant * 100) / 100; // Arrondi à deux décimales
    this.montantHebdomadaire = this.currencyPipe.transform(this.montantHebdomadaire,'XOF','symbol' );
  }
  formatMontantJournaliere() {
    //this.montant = parseFloat(this.montant.toString().replace(',', '.')); // Remplacez la virgule par le point décimal si nécessaire
    //this.montant = Math.round(this.montant * 100) / 100; // Arrondi à deux décimales
    this.montantJournalier = this.currencyPipe.transform(this.montantJournalier,'XOF','symbol' );
  }

  parseMontant(montantFormatted: string | null): number {
    if(montantFormatted){
      const digitsOnly = montantFormatted.replace(/[^\d.,]/g, ''); // Retirer tous les caractères non numériques sauf les virgules et les points décimaux
      return parseFloat(digitsOnly.replace(',', '.')); // Remplacez la virgule par le point décimal si nécessaire et convertissez en nombre
    }
    return 0;
  }

  addControl() {
    if (this.cTransacForm.valid) {
      if (this.editData) {
        console.log(this.cTransacForm.value)
        this.updateControl();
        return;
      }
      console.log(this.cTransacForm.value)
      this.api.createNewControlTransaction(this.getControlFromForm()).subscribe(
        {
          next: ()=> {
            this.notify.snackMessage(`Contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenPoint.name} ajouté avec succès`,
              2500, "success");
            this.dialogRef.close('OK');
          }
          ,
          error: error => {
            console.error(error)
            if (error.statusCode === 400)
              this.notify.snackMessage(`un contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenPoint.name} a déjà été soumis`,
                3000, "danger");
          }
        }
      )
    }
  }

  updateControl() {
    this.api.updateControlTransaction(this.getControlFromForm(), this.editData.id!).subscribe(
      {
        next: () => {
          this.notify.snackMessage(`Contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenPoint.name} mis à jour avec succès`,
            2500, "success");
          this.dialogRef.close('OK');
        }
        ,
        error: error => {
          if (error.statusCode === 400)
            this.notify.snackMessage(`un contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenPoint.name} a déjà été soumis`,
              3000, "danger");
        }
      }
    )
  }

  onChooseService() {
    this.api.getServiceById(Number(this.cTransacForm.controls['service'].value)).pipe(
      tap(console.dir)
    )
      .subscribe(
        res => {
          this.chosenService = res.data
        }
      )

  }

  onChooseSousCompte() {
    this.chosenPoint = this.listPoints
      .find(x => x.id === Number(this.cTransacForm.controls['point'].value))!;
    /*this.api.getPointsById(Number(this.cTransacForm.controls['points'].value)).pipe(
      tap(console.dir)
    )
      .subscribe(
        res => {
          this.chosenPoint = res.data
        }
      )*/

  }

  getErrorMessage(errors: ValidationErrors) {
    if (errors['required']) {
      return 'Champ Obligatoire'
    } else if (errors['pattern']) {
      return 'Le champ est mal renseigné'
    } else if (errors['minlength']) {
      return 'Champ doit contenir au minimum ' + errors['minlength']['requiredLength'] + ' caracteres'
    } else {
      return "Erreur au niveau de ce champ"
    }
  }

  getControlFromForm() {
    const {
      heureDebut,
      heureFin
    } = this.cTransacForm.value
    return <ControlTransactionInterface>{
      service: this.chosenService,
      point: this.chosenPoint,
      montantSeuil: Number(this.parseMontant(this.montantSeuil)),
      montantJournalier: Number(this.parseMontant(this.montantJournalier)),
      montantHebdomadaire: Number(this.parseMontant(this.montantHebdomadaire)),
      heureDebut,
      heureFin
    }
  }

  hasAvalue(value: number | string): boolean {
    return !(value === '' || value === 0)
  }


}
