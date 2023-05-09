import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SousCompteService} from "../../../service/SousCompte/sous-compte.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SousCompteModel} from "../../../model/sousCompte.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogSousCompteComponent} from "../../../dialog/SousCompte/dialog-sous-compte.component";
import {DialogAccesSCompteComponent} from "../../../dialog/SousCompteAcces/dialog-acces-s-compte.component";
import {NotifyService} from "../../../service/utils/notify.service";

@Component({
  selector: 'app-sous-comptes',
  templateUrl: './sous-comptes.component.html',
  styleUrls: ['./sous-comptes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SousComptesComponent implements OnInit {


  columnsToDisplay = ['sousCompteName', 'compte', 'sreseau'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,'action', 'expand'];
  expandedElement ?: SousCompteModel | null;

  dataSource !: MatTableDataSource<SousCompteModel>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(public api: SousCompteService,
              public dialog : MatDialog,
              private notify: NotifyService) { }

  ngOnInit(): void {

    this.getMySousComptes();
  }

  getMySousComptes(){
    this.api.getMySousComptes().subscribe( {
      next: value => {
        this.dataSource = new MatTableDataSource<SousCompteModel>(value.data as SousCompteModel[]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  add(){
    this.dialog.open(DialogSousCompteComponent).afterClosed().subscribe(value => {
      if(value==='OK'){
        this.getMySousComptes();
      }
    })
  }

  update(row : SousCompteModel){
    this.dialog.open(DialogSousCompteComponent,{
      data : row
    }).afterClosed().subscribe(value => {
      if(value==='OK'){
        this.getMySousComptes();
      }
    })
  }

  getColumnName(code: string): string {
    return code === 'sousCompteName' ? 'Sous-Compte' :
      (code === 'compte'? 'Compte' : (code === 'sreseau'? 'Sous-Réseau' : ''));
  }
  delete(row : SousCompteModel){
    let conf = confirm("Etes vous sûr de vouloir supprimer ce sous-compte")
    if(!conf){
      return;
    }
    this.api.deleteSCompte(row.id!).subscribe({
      next:()=>{
        this.getMySousComptes();
        this.notify.snackMessage(`Sous-Compte ${row.sousCompteName} supprimé avec succès`, 2000, "success");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addAccesToSousCompte(){
    this.dialog.open(DialogAccesSCompteComponent).afterClosed().subscribe(value => {
      if(value==='OK'){
        this.getMySousComptes();
      }
    })
  }
}
