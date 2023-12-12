import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserModel} from "../../model/user.model";
import {CompteModel, NatureCompte} from "../../model/compte.model";
import {SousReseauInterface} from "../../model/sous-reseau.interface";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotifyService} from "../../service/utils/notify.service";
import {SousCompteService} from "../../service/SousCompte/sous-compte.service";
import {SousCompteModel} from "../../model/sousCompte.model";
import {MatSelectChange} from "@angular/material/select";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-sous-compte',
  templateUrl: './dialog-sous-compte.component.html',
  styleUrls: ['./dialog-sous-compte.component.scss']
})
export class DialogSousCompteComponent implements OnInit {

  dataSourceAgents !: MatTableDataSource<UserModel>;

  AllCompte !: CompteModel[];
  ComptePrin !: CompteModel | undefined;
  listSousReseaux !: SousReseauInterface[];
  chosenSousReseau !: SousReseauInterface;
  listAgents !: UserModel[];
  currentListAgents: UserModel[] = [];

  title : string = "Ajouter un Sous-Compte"
  actionBtn : string = "Sauvegarder";

  displayedColumns = ['name', 'action'];

  sousCompteForm : FormGroup = this.formBuilder.group({
    sousCompteName : ['', Validators.required],
    sreseau : ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    accesCollection: '',
  })

  constructor(private formBuilder : FormBuilder ,
              private api : SousCompteService ,
              @Inject(MAT_DIALOG_DATA) public editData : SousCompteModel,
              private notify: NotifyService,
              private dialogRef : MatDialogRef<DialogSousCompteComponent>) { }

  ngOnInit(): void {
   /* this.api.getMyPoints().subscribe(
      res=> this.listPoints = <PointsInterface[]> res.data,
    )*/

    this.api.getMyAgents().pipe(
      map(res => {
        let users = <UserModel[]>res.data;
        return users.filter(user => user.roles?.code === 'OPERATEUR')
      }),
    ).subscribe(
      ops => {
        this.listAgents = ops;
      }
    );

    this.api.getMySousReseaux().subscribe({
      next: res => {
        this.listSousReseaux = <SousReseauInterface[]> res.data;
      }
    });

    this.api.getMyCompte().subscribe(
      res =>{
        this.AllCompte = res.data as CompteModel[]
        this.ComptePrin = this.AllCompte.find(compt => compt.natureCompte === NatureCompte.PRINCIPAL);
      }
    )

    if (this.editData) {
      this.title = "Modifier un Sous-Compte";
      this.actionBtn = "Mettre à jour";

      this.sousCompteForm.controls['sousCompteName'].setValue(this.editData.sousCompteName);
      this.sousCompteForm.controls['sreseau'].setValue(this.editData.sreseau.id!);
      this.chosenSousReseau = this.editData.sreseau;
      // this.currentListPoints = this.editData.points;
      this.currentListAgents = this.editData.accesCollection;
      this.setAgentTableRows(this.currentListAgents);

    }
  }

  addSousCompte() {
    if (this.sousCompteForm.valid){
      if (!this.editData) {
        console.log(this.getSousCompte())
        this.api.addSCompte(this.getSousCompte()).subscribe(
          () => {
            this.dialogRef.close('OK');
            this.notify
              .snackMessage(`Sous-Compte ${this.getSousCompte().sousCompteName} a été ajouté avec succès`,
                2500, "success")
          },
        );
      } else {
        this.updateSousCompte();
      }
    }
  }

  updateSousCompte() {
    this.editData.sousCompteName = this.sousCompteForm.controls['sousCompteName'].value!;
    if (this.ComptePrin) {
      this.editData.compte = this.ComptePrin;
    }
    this.editData.sreseau = this.chosenSousReseau;
    this.editData.accesCollection = this.currentListAgents;
    // this.editData.points = this.currentListPoints;

    this.api.updateSCompte(this.editData).subscribe(
      () => {
        this.dialogRef.close('OK');
        this.notify
          .snackMessage(`Sous-Compte ${this.getSousCompte().sousCompteName} a été modifié avec succès`,
            2500, "success")
      },
    )
  }
  getErrorMessage( errors : ValidationErrors){
    if(errors['required']){
      return 'Champs Obligatoire'
    }else if(errors['minlength']){
      return 'Champs doit contenir au minimum '+errors['minlength']['requiredLength']+' caracteres'
    }else{
      return "Erreur au niveau de ce champ"
    }
  }

  getSousCompte(): SousCompteModel {
    return <SousCompteModel> {
      sousCompteName: this.sousCompteForm.controls['sousCompteName'].value,
      compte: this.ComptePrin,
      sreseau: this.chosenSousReseau,
      accesCollection: this.currentListAgents,
      // points: this.currentListPoints
    }
  }

/*  addPoint() {
    let chosenPoint = this.listPoints
      .find(x=> x.id.toString() === this.sousCompteForm.controls['points'].value);

    if (chosenPoint && !this.currentListPoints.includes(chosenPoint)) {
      this.currentListPoints.push(chosenPoint);
      this.setPointTablerows(this.currentListPoints);
    } else {
      this.notify.snackMessage('Ce Point a déjà été ajouté', 3000, 'warning');
    }
    this.sousCompteForm.controls['points'].setValue(null);
  }

  deletePoint(row: PointsInterface) {
    let index = this.currentListPoints.indexOf(row);
    if (index !== -1) {
      this.currentListPoints.splice(index, 1);
      this.setPointTablerows(this.currentListPoints);
    }
  }*/

  addAgent() {
    let chosenAgent = this.listAgents
      .find(x=> x.id === Number(this.sousCompteForm.value.accesCollection));
    console.log('Agent choisi ',chosenAgent);
    console.log('Type champ', typeof this.sousCompteForm.controls['accesCollection'].value);
    console.log('Valeur champ', this.sousCompteForm.controls['accesCollection'].value);
    if (chosenAgent && !this.currentListAgents.includes(chosenAgent)) {
      this.currentListAgents.push(chosenAgent);
      this.setAgentTableRows(this.currentListAgents);
    } else if(this.currentListAgents.length > 0) {
      this.notify.snackMessage('Cet opératreur a déjà été ajouté', 3000, 'danger');
    }else{
      this.notify.snackMessage('Veillez choisir un agent', 3000, 'danger');
    }
    this.sousCompteForm.controls['accesCollection'].setValue(null);
  }

  deleteAgent(acces: UserModel) {
    let index = this.currentListAgents.indexOf(acces);
    if (index !== -1) {
      this.currentListAgents.splice(index, 1);
      this.setAgentTableRows(this.currentListAgents);
    }
  }

  setAgentTableRows(agents: UserModel[]) {
    this.dataSourceAgents = new MatTableDataSource<UserModel>(agents);
  }

  onChooseSousReseau(event: MatSelectChange) {
    console.log(event, typeof event, typeof event.value);
    this.chosenSousReseau = this.listSousReseaux
      .find(x=> x.id == event.value)!
  }
}
