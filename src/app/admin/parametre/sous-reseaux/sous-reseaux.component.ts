import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SousReseauxService} from "../../../service/SousReseauService/sous-reseaux.service";
import {MatDialog} from "@angular/material/dialog";
import {ApiResponse} from "../../../request/ApiResponse";
import {ReseauModel} from "../../../model/reseau.model";
import {DialogSousReseauxComponent} from "../../../dialog/Sous-Reseaux/dialog-sous-reseaux.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {DialogAccesSCompteComponent} from "../../../dialog/SousCompteAcces/dialog-acces-s-compte.component";
import {SousReseauInterface} from "../../../model/sous-reseau.interface";
import {NotifyService} from "../../../service/utils/notify.service";
import {SousCompteModel} from "../../../model/sousCompte.model";
import {forkJoin} from "rxjs";

type columnName = 'sousReseauName' | 'code' | 'reseau' |  'acces';

@Component({
  selector: 'app-sous-reseaux',
  templateUrl: './sous-reseaux.component.html',
  styleUrls: ['./sous-reseaux.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SousReseauxComponent implements OnInit {

  load : boolean = false
  columnsToDisplay: columnName[] = [ 'code','sousReseauName'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'action', 'expand'];
  expandedElement ?: SousCompteModel;
  listSComptes!: SousCompteModel [];

  dataSource !: MatTableDataSource<SousReseauInterface>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private apiSousReseau: SousReseauxService,
              public dialog: MatDialog,
              private notify: NotifyService) {
  }

  ngOnInit(): void {
    this.apiSousReseau.getMySousComptes().subscribe(
      res => this.listSComptes = res.data as SousCompteModel[],
    );

    this.getMySousReseaux();
  }

  getMySousReseaux() {
    forkJoin({
      sousReseaux: this.apiSousReseau.getMySousReseaux(),
      scomptes: this.apiSousReseau.getMySousComptes()
    }).subscribe({
      next: (res: { sousReseaux: ApiResponse, scomptes: ApiResponse }) => {
        console.log(res.sousReseaux.data);
        console.log(res.scomptes.data);

        const sousReseaux: SousReseauInterface[] = <SousReseauInterface[]>res.sousReseaux.data ;
        const scomptes: SousCompteModel[] = res.scomptes.data as SousCompteModel[];

        sousReseaux.forEach(sousReseau => {
          sousReseau.scomptes = this.getSousComptesBySReseauId(scomptes, sousReseau.id!);
        });

        this.dataSource = new MatTableDataSource<SousReseauInterface>(sousReseaux);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.load = true;
      }
    });
  }

/*
  getMySousReseaux() {
    this.apiSousReseau.getMySousReseaux()
      .subscribe({
        next: (res: ApiResponse) => {
          console.log(res.data)
          this.dataSource = new MatTableDataSource(<SousReseauInterface[]>res.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
  }
*/

  update(row: ReseauModel) {
    this.dialog.open(DialogSousReseauxComponent, {
      data: row,
    }).afterClosed().subscribe(value => {
      if (value === 'OK') {
        this.getMySousReseaux();
      }
    })
  }

  add() {
    this.dialog.open(DialogSousReseauxComponent,
      {
        width: '25rem',
      }).afterClosed().subscribe(value => {
      if (value === 'OK') {
        this.getMySousReseaux();
      }
    })
  }

  addAccesToReseau() {
    this.dialog.open(DialogAccesSCompteComponent,{
        height: '17rem',
      }).afterClosed().subscribe(value => {
      if (value === 'save') {
        this.getMySousReseaux();
      }
    })
  }

  delete(row: SousReseauInterface) {
    let conf = confirm("Etes vous sûr de vouloir supprimer le sous-réseau " + row.sousReseauName + ' ?')
    if (!conf) {
      return;
    }
    this.apiSousReseau.deleteSousReseau(row.id!).subscribe({
      next: () => {
        this.getMySousReseaux();
        this.notify.snackMessage('Sous-Réseau supprimé avec succès', 2500, 'success');
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

  getColumnName(column: columnName): string {
    if (column !== 'sousReseauName') {
      return column.charAt(0).toUpperCase() + column.slice(1);
    } else {
      return 'Sous Réseau';
    }
  }

  getSousComptesBySReseauId(scomptes: SousCompteModel[], id: number): SousCompteModel [] {
    return  scomptes.filter( scompte => scompte.sreseau.id === id);
  }
}
