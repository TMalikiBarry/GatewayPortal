import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {ControlTransactionService} from "../../service/controlTransaction/control-transaction.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ControlTransactionInterface} from "../../model/control-transaction.interface";
import {NotifyService} from "../../service/utils/notify.service";
import {SousCompteModel} from "../../model/sousCompte.model";
import {ServiceModel} from "../../model/service.model";
import {Observable, tap} from "rxjs";
import {UserModel} from "../../model/user.model";
import {map} from "rxjs/operators";
import {AVAILABLE_SERVICES} from "../../../assets/List-Service-Dispo/Available_Services";

@Component({
  selector: 'app-dialog-control-trans',
  templateUrl: './dialog-control-trans.component.html',
  styleUrls: ['./dialog-control-trans.component.scss']
})
export class DialogControlTransComponent implements OnInit {

  title: string = "Ajouter un";
  actionBtn: string = "ENREGISTRER";

  listSousComptes!: SousCompteModel[];
  chosenSousCompte!:SousCompteModel;

  listServices$!:Observable<ServiceModel[]>;
  chosenService!: ServiceModel;

  // service: ServiceModel;
  // sCompte: SousCompteModel;
  // montantSeuil: number;
  // montantHebdomadaire?: number;
  // montantJournalier?: number;
  // heureDebut?: string;
  // heureFin?: string;
  cTransacForm = this.fb.group({
    service : ['', Validators.required],
    scompte : ['', Validators.required],
    montantSeuil : [ '' , [Validators.required, Validators.pattern("^[1-9]*[05]+$")]],
    montantHebdomadaire : [ '', [Validators.pattern("^[1-9]*[05]+$")]],
    montantJournalier : ['', Validators.pattern("^[1-9]*[05]+$")],
    heureDebut: '',
    heureFin: '',
  })

  constructor(private fb: FormBuilder,
              private api: ControlTransactionService,
              @Inject(MAT_DIALOG_DATA) public editData : ControlTransactionInterface,
              private notify: NotifyService,
              private dialogRef: MatDialogRef<DialogControlTransComponent>) { }

  ngOnInit(): void {
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.api.getMySousComptes(myId).subscribe(
      res => {
        this.listSousComptes = res.data as SousCompteModel[];
      }
    );
    this.listServices$ = this.api.getAllService().pipe(
      map(res => res.data as ServiceModel[]),
      map(services => services.filter(service=> AVAILABLE_SERVICES.includes(service.serviceName)))
    );

    if (this.editData){
      this.title = "Modifier le";
      this.actionBtn = "Mettre à jour"

      this.chosenSousCompte = this.editData.scompte;
      this.chosenService = this.editData.service;
      this.cTransacForm.controls['service'].setValue(this.editData.service.id.toString());
      this.cTransacForm.controls['scompte'].setValue(this.editData.scompte.id!.toString());
      this.cTransacForm.controls['montantSeuil'].setValue(this.editData.montantSeuil.toString());
      this.cTransacForm.controls['montantJournalier'].setValue(this.editData.montantJournalier!.toString());
      this.cTransacForm.controls['montantHebdomadaire'].setValue(this.editData.montantHebdomadaire!.toString());
      this.cTransacForm.controls['heureDebut'].setValue(this.editData.heureDebut!.toString());
      this.cTransacForm.controls['heureFin'].setValue(this.editData.heureFin!);
    }
  }

  addControl(){
    if (this.cTransacForm.valid) {
      if (this.editData){
        this.updateControl();
        return;
      }
      this.api.createNewControlTransaction(this.getControlFromForm()).subscribe(
        ()=> {
          this.notify.snackMessage(`Contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenSousCompte.sousCompteName} ajouté avec succès`,
            2500, "success");
          this.dialogRef.close('OK');
        },
        error => {
          console.error(error)
          if (error.statusCode === 400)
            this.notify.snackMessage(`un contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenSousCompte.sousCompteName} a déjà été soumis`,
              3000, "danger");
        }
      )
    }
  }

  updateControl(){
    this.api.updateControlTransaction(this.getControlFromForm(), this.editData.id!).subscribe(
      ()=> {
        this.notify.snackMessage(`Contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenSousCompte.sousCompteName} ajouté avec succès`,
          2500, "success");
        this.dialogRef.close('OK');
      },
      error => {
        if (error.statusCode === 400)
          this.notify.snackMessage(`un contrôle pour le service ${this.chosenService.serviceName} et le sous-compte ${this.chosenSousCompte.sousCompteName} a déjà été soumis`,
            3000, "danger");
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
    this.api.getSousCompteById(Number(this.cTransacForm.controls['scompte'].value)).pipe(
      tap(console.dir)
    )
      .subscribe(
        res => {
          this.chosenSousCompte = res.data
        }
      )
  }
  getControlFromForm(){
    const {montantSeuil, montantJournalier,
      montantHebdomadaire, heureDebut,
      heureFin} = this.cTransacForm.value
    return <ControlTransactionInterface> {
      service: this.chosenService,
      scompte: this.chosenSousCompte,
      montantSeuil: Number(montantSeuil),
      montantJournalier: Number(montantJournalier),
      montantHebdomadaire: Number(montantHebdomadaire),
      heureDebut,
      heureFin
    }
  }

  hasAvalue(value: number|string): boolean {
    return !(value === '' || value === 0)
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



}
