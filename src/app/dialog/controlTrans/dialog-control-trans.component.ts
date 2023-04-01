import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {ControlTransactionService} from "../../service/controlTransaction/control-transaction.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ControlTransactionInterface} from "../../model/control-transaction.interface";
import {NotifyService} from "../../service/utils/notify.service";
import {SousCompteModel} from "../../model/sousCompte.model";
import {ServiceModel} from "../../model/service.model";
import {Observable} from "rxjs";
import {UserModel} from "../../model/user.model";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-dialog-control-trans',
  templateUrl: './dialog-control-trans.component.html',
  styleUrls: ['./dialog-control-trans.component.scss']
})
export class DialogControlTransComponent implements OnInit {

  title: string = "Ajouter";
  actionBtn: string = "ENREGISTRER";

  listSousComptes!: SousCompteModel[];
  chosenSousCompte!:SousCompteModel;

  listServices$!:Observable<ServiceModel[]>;
  chosenService?: ServiceModel;

  // service: ServiceModel;
  // sCompte: SousCompteModel;
  // montantSeuil: number;
  // montantHebdomadaire?: number;
  // montantJournalier?: number;
  // heureDebut?: string;
  // heureFin?: string;
  cTransacForm = this.fb.group({
    service : [{}, Validators.required],
    sCompte : [{}, Validators.required],
    montantSeuil : [0, [Validators.required, Validators.pattern("^[1-9]\d*[05]$")]],
    montantHebdomadaire : [0, [Validators.pattern("^[1-9]\d*[05]$")]],
    montantJournalier : [0, Validators.pattern("^[1-9]\d*[05]$")],
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
      map(res => res.data as ServiceModel[])
    );

    if (this.editData){
      this.title = "Modifier";
      this.actionBtn = "Mettre à jour"
      const {montantSeuil, montantHebdomadaire, montantJournalier,
        heureDebut, heureFin} = this.editData;
      let service = this.editData.service.serviceName;
      let sCompte = this.editData.sCompte.sousCompteName;
      this.cTransacForm.controls['service'].setValue(this.editData.service.serviceName);
      this.cTransacForm.controls['sCompte'].setValue(this.editData.sCompte.sousCompteName);
      this.cTransacForm.controls['montantSeuil'].setValue(this.editData.montantSeuil);
      this.cTransacForm.controls['montantJournalier'].setValue(this.editData.montantJournalier!);
      this.cTransacForm.controls['montantHebdomadaire'].setValue(this.editData.montantHebdomadaire!);
      this.cTransacForm.controls['heureDebut'].setValue(this.editData.heureDebut!.toString());
      this.cTransacForm.controls['heureFin'].setValue(this.editData.heureFin!);
    }
  }

  addControl(){
    if (this.cTransacForm.valid) {

    }
  }

  updateControl(){

  }
  onChooseService() {
  }
  onChooseSousCompte() {
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
