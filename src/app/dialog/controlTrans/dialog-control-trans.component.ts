import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {ControlTransactionService} from "../../service/controlTransaction/control-transaction.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ControlTransactionInterface} from "../../model/control-transaction.interface";
import {NotifyService} from "../../service/utils/notify.service";
import {ServiceModel} from "../../model/service.model";
import {forkJoin, Observable, tap} from "rxjs";
import {UserModel} from "../../model/user.model";
import {map} from "rxjs/operators";
import {AVAILABLE_SERVICES} from "../../../assets/List-Service-Dispo/Available_Services";
import {PointsInterface} from "../../model/points.interface";
import {CurrencyPipe} from "@angular/common";
import {AuthService} from "../../service/authService/auth.service";
import {SousCompteService} from "../../service/SousCompte/sous-compte.service";
import {SousCompteModel} from "../../model/sousCompte.model";

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
  sousCompteCom !: SousCompteModel[]
  sousCompteSup !: SousCompteModel | undefined

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
              private auth : AuthService,
              private apiScompte : SousCompteService,
              @Inject(MAT_DIALOG_DATA) public editData: ControlTransactionInterface,
              private notify: NotifyService,
              private dialogRef: MatDialogRef<DialogControlTransComponent>) {
  }

  ngOnInit(): void {
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    if(this.auth.getRole() === 'SUPERVISEUR'){
      myId = (<UserModel>JSON.parse(localStorage.getItem('utilisateur')!)).idParent;
    }

    this.apiScompte.getMySousComptes(myId).subscribe(
      res => {
        this.sousCompteCom = res.data as SousCompteModel[]
        console.log(this.sousCompteCom)
        this.sousCompteSup = this.sousCompteCom.find(scompte => scompte.accesCollection.find(acces => acces.id === this.auth.getId()))
      }
    )

    const observablePoints = this.api.getMyPoints(myId)
    const observableControls = this.api.getMyControlTransactions(myId)
    forkJoin([observablePoints, observableControls]).subscribe(
      ([result1, result2]) => {
        if(this.editData){
          this.listPoints = result1.data as PointsInterface[]
        }else {
          this.listPoints = this.checkPointIsControlAndActeur(result1.data as PointsInterface[],result2.data as ControlTransactionInterface[])
        }
        console.log(this.listPoints)
      },
      error => {
        console.error('Une erreur s\'est produite : ', error);
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

  checkPointIsControlAndActeur(points: PointsInterface[], controls: ControlTransactionInterface[]): PointsInterface[] {
    // Vérifie si chaque élément de la première liste a un correspondant dans la deuxième liste
    const nonExistentInList1 = controls.filter(item2 => !points.some(item1 => item1.id === item2.point.id));
    const nonExistentInList2 = points.filter(item1 => !controls.some(item2 => item2.point.id === item1.id));

    // Concaténer les deux listes pour obtenir tous les éléments uniques
    let nonExistentItems = [...nonExistentInList1, ...nonExistentInList2] as PointsInterface[];

    // verifier si le point fait partie du sous compte du superviseur
    if(this.auth.getRole() === 'SUPERVISEUR')
      nonExistentItems = nonExistentItems.filter(points => points.scompte.id === this.sousCompteSup?.id )
    return nonExistentItems
  }

  hasAvalue(value: number | string): boolean {
    return !(value === '' || value === 0)
  }


}
