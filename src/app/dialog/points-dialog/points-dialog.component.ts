import {Component, Inject, OnInit} from '@angular/core';
import {PointsInterface} from "../../model/points.interface";
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotifyService} from "../../service/utils/notify.service";
import {UserModel} from "../../model/user.model";
import {map} from "rxjs/operators";
import {SousCompteModel} from "../../model/sousCompte.model";
import {PointService} from "../../service/PointService/point.service";

@Component({
  selector: 'app-points-dialog',
  templateUrl: './points-dialog.component.html',
  styleUrls: ['./points-dialog.component.scss']
})
export class PointsDialogComponent implements OnInit {

  title: string = "Ajouter un";
  actionBtn: string = "ENREGISTRER";

  allMyOperators!: UserModel[];
  chosenOperator!: UserModel;

  allMySousComptes!: SousCompteModel[];
  chosenSousCompte!: SousCompteModel;

  pointForm = this.fb.group({
    name: ['', Validators.required],
    position: ['', [Validators.required, Validators.pattern(/^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/)]],
    scompte: ['', Validators.required],
    acces: ['', Validators.required],

  })

  constructor(private fb: FormBuilder,
              private api: PointService,
              @Inject(MAT_DIALOG_DATA) public editData: PointsInterface,
              private notify: NotifyService,
              private dialogRef: MatDialogRef<PointsDialogComponent>) {
  }

  ngOnInit(): void {
    this.api.getMyAgents().pipe(
      map(res => {
        let users = <UserModel[]>res.data;
        return users.filter(user => user.roles?.some(role => role.code === 'OPERATEUR'))
      }),
    ).subscribe(
      ops => {
        this.allMyOperators = ops;
      }
    );
    this.api.getMySousComptes().subscribe(
      res => this.allMySousComptes = <SousCompteModel[]>res.data,
    );

    if (this.editData) {
      this.title = "Modifier le";
      this.actionBtn = "Mettre à jour"

      this.chosenOperator = this.editData.acces;
      this.chosenSousCompte = this.editData.scompte;
      this.pointForm.controls['scompte'].setValue(this.editData.scompte.id!.toString());
      this.pointForm.controls['acces'].setValue(this.editData.acces.id!.toString());
      this.pointForm.controls['name'].setValue(this.editData.name);
      this.pointForm.controls['position'].setValue(`${this.editData.latitude}, ${this.editData.longitude}`);
    }
  }

  addControl() {
    if (this.pointForm.valid) {
      if (this.editData) {
        this.updateControl();
        return;
      }
      this.api.addPoint(this.getPointFromForm()).subscribe(
        {
          next: () => {
            this.notify.snackMessage(`Point pour l'opérateur ${this.chosenOperator.name} et le sous-compte ${this.chosenSousCompte.sousCompteName} ajouté avec succès`,
              2500, "success");
            this.dialogRef.close('OK');
          }
        }
      )
    }
  }

  updateControl() {
    this.editData = {...this.getPointFromForm()}
    this.api.updatePoint(this.editData).subscribe(
      () => {
        this.notify.snackMessage(`Point pour l'opérateur ${this.chosenOperator.name} et le sous-compte ${this.chosenSousCompte.sousCompteName} mis à jour avec succès`,
          2500, "success");
        this.dialogRef.close('OK');
      }
    )
  }

  onChooseSousCompte() {
    this.chosenSousCompte = this.allMySousComptes
      .find(x => x.id!.toString() == this.pointForm.controls['scompte'].value)!;
  }

  onChooseOperator() {
    this.chosenOperator = this.allMyOperators
      .find(x => x.id == Number(this.pointForm.controls['acces'].value))!;
    /*this.api.getPointsById(Number(this.cTransacForm.controls['points'].value)).pipe(
      tap(console.dir)
    )
      .subscribe(
        res => {
          this.chosenPoint = res.data
        }
      )*/

  }

  getPositionInfos(): string [] {
    return this.pointForm.value.position!.replace(/\s/g, '').split(',');
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

  private getPointFromForm() {
    let pos = this.getPositionInfos();
    return {
      name: this.pointForm.value.name,
      acces: this.chosenOperator,
      scompte: this.chosenSousCompte,
      latitude: pos[0],
      longitude: pos[1],
    } as PointsInterface;
  }
}
