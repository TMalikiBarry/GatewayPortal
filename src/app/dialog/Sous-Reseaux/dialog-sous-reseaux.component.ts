import {Component, Inject, OnInit} from '@angular/core';
import {UserModel} from "../../model/user.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SousReseauxService} from "../../service/SousReseauService/sous-reseaux.service";
import {ReseauModel} from "../../model/reseau.model";
import {SousReseauInterface} from "../../model/sous-reseau.interface";
import {NotifyService} from "../../service/utils/notify.service";
import {tap} from "rxjs";
import {map} from "rxjs/operators";
import {MatSelectChange} from "@angular/material/select";


export class AccesReseau {
  username ?: string
  reseau ?: string
}

@Component({
  selector: 'app-dialog-sous-reseaux',
  templateUrl: './dialog-sous-reseaux.component.html',
  styleUrls: ['./dialog-sous-reseaux.component.scss']
})
export class DialogSousReseauxComponent implements OnInit {

/*  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  dataSource!: MatTableDataSource<SousCompteModel>;*/

  title : string = "Ajouter un Sous-Réseau"
  // valueUser : UserModel[] = [];
  myReseau!: ReseauModel;
  // currentListSComptes!: SousCompteModel[];
  sousReseauForm !: FormGroup;
  actionBtn : string = "Sauvegarder";
  listSuperviseurs!: UserModel[];
  superviseur!: UserModel;

  // displayedColumns = ['name','action'];

  constructor(private formBuilder : FormBuilder ,
              private api : SousReseauxService ,
              @Inject(MAT_DIALOG_DATA) public editData : SousReseauInterface,
              private notify: NotifyService,
              private dialogRef : MatDialogRef<DialogSousReseauxComponent>) { }

  ngOnInit(): void {
    /*this.api.getMySousComptes().subscribe({
      next: res => this.listSousComptes = res.data as SousCompteModel[],
    });*/
    this.api.getAllMySuperviseurs().pipe(
      map(res=> {
        let users = res.data as UserModel[];
        return users.filter(user => user.roles?.code === 'OPERATEUR');
      }),
      tap(console.dir),
    ).subscribe(
      superviseurs => this.listSuperviseurs = superviseurs,
    );

    this.api.getMyReseau().pipe(
      tap(console.dir),
      map(res => res.data as ReseauModel)
    ).subscribe({
      next: reseau => this.myReseau = reseau
    });
    this.sousReseauForm = this.formBuilder.group({
      id : [''],
      sousReseauName : ['',[Validators.required, Validators.minLength(3)]],
      // acces : ['',[Validators.required]],
    });

    if(this.editData){
      this.title = "Modifier un Sous-Réseau";
      this.actionBtn = "Mettre a jour";
      this.sousReseauForm.controls['id'].setValue(this.editData.id);
      this.sousReseauForm.controls['sousReseauName'].setValue(this.editData.sousReseauName);
      //this.sousReseauForm.controls['acces'].setValue(this.editData.acces.id);

      // this.currentListSComptes = this.editData.scomptes;
    }
  }
  addSousReseau(){
    if (this.sousReseauForm.valid) {
      if (!this.editData) {
        this.api.postSousReseau(this.getSousReseau()).subscribe({
          next: () => {
            this.dialogRef.close('OK');
            this.notify
              .snackMessage(`Sous-Reseau ${this.getSousReseau().sousReseauName} a été ajouté avec succès`,
                2500, "success")
          },
        })
      } else {
        this.updateSousReseau();
      }
    }
  }

  updateSousReseau(){
    this.editData.sousReseauName = this.sousReseauForm.controls['sousReseauName'].value;
    // this.editData.scomptes = this.currentListSComptes;
    this.editData.reseau = this.myReseau;
    this.api.putSousReseau(this.editData).subscribe(
      ()=> {
        this.dialogRef.close('OK');
        this.notify
          .snackMessage(`Sous-Réseau ${this.editData.sousReseauName} mis à jour avec succès`,
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
      return ""
    }
  }

  getSousReseau(): SousReseauInterface{
    return <SousReseauInterface>{
      sousReseauName: this.sousReseauForm.controls['sousReseauName'].value,
      // scomptes: this.currentListSComptes,
      acces: this.superviseur,
      reseau: this.myReseau,
    }
  }

  onChooseAcces(event: MatSelectChange) {
    this.superviseur = this.listSuperviseurs.find(sup => sup.id == event.value)!;
  }

  /*  filter(data : any){
      this.valueUser = data.value
      console.log(this.valueUser)
    }*/
  /*addSCompte(){
    let chosenSCompte = this.listSousComptes
      .find(x => x.id == this.sousReseauForm.controls['scomptes'].value);
    if (chosenSCompte && !this.currentListSComptes.includes(chosenSCompte)) {
      this.currentListSComptes.push(chosenSCompte);
      this.getTable(this.currentListSComptes);
    } else {
      this.notify.snackMessage('Ce Sous-Compte a déjà été ajouté', 3000, 'warning');
    }
    this.sousReseauForm.controls['scomptes'].setValue(null);
  }

  deleteSCompte(row: SousCompteModel){
    let index = this.currentListSComptes.indexOf(row);
    if (index !== -1) {
      this.currentListSComptes.splice(index, 1);
      this.getTable(this.currentListSComptes);
    }
  }

  getTable(rows : SousCompteModel[]){
    this.dataSource = new MatTableDataSource(rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }*/
}
