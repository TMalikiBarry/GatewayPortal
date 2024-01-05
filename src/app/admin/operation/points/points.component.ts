import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {NotifyService} from "../../../service/utils/notify.service";
import {PointsInterface} from "../../../model/points.interface";
import {PointService} from "../../../service/PointService/point.service";
import {PointsDialogComponent} from "../../../dialog/points-dialog/points-dialog.component";
import {UserModel} from "../../../model/user.model";
import {SousCompteModel} from "../../../model/sousCompte.model";
import {AuthService} from "../../../service/authService/auth.service";
import {UserService} from "../../../service/UserService/user.service";
import {SousCompteService} from "../../../service/SousCompte/sous-compte.service";

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {

  load : boolean = false
  dataSource!: MatTableDataSource<PointsInterface>;
  columnsToDisplay = ['name', 'long', 'lat', 'sous-compte', 'acces', 'action'];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(private api: PointService,
              private apiUser : UserService,
              private apiScompte : SousCompteService,
              private auth : AuthService,
              private dialog: MatDialog,
              private notify: NotifyService) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getMyPoints();
  }

  getMyPoints(){
    if(this.auth.getRole() === 'SUPERVISEUR'){
          let superviseur  = (<UserModel>JSON.parse(localStorage.getItem('utilisateur')!));
          //recuperer les sous compte du commercant
          this.apiScompte.getMySousComptes(superviseur.idParent).subscribe({
            next : resSC => {
              let scompteCom  = resSC.data as SousCompteModel[]
              let scomptSup = scompteCom.find(scompte => scompte.accesCollection.find(acces => acces.id === this.auth.getId()))
              if(scomptSup)
                this.api.getPointsByIdScompte(scomptSup?.id).subscribe({
                  next : resPointSc => {
                    let table = resPointSc.data as PointsInterface[]
                    this.dataSource = new MatTableDataSource(table);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.load = true;
                  }
                })
            }
          })
        }else {
          this.api.getMyPoints().subscribe({
            next : value => {
              let table = value.data as PointsInterface[]
              this.dataSource = new MatTableDataSource(table);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.load = true;
        }
      })
    }
  }

  addAControl() {
    this.dialog.open(PointsDialogComponent, {
      width: '35rem',
    }).afterClosed().subscribe(
      (res) => {
        if (res === 'OK')
          this.getMyPoints();
      }
    )
  }

  updatePoint(row: PointsInterface) {
    this.dialog.open(PointsDialogComponent, {
      width: '35rem',
      data: row
    }).afterClosed().subscribe(
      (res) => {
        if (res === 'OK')
          this.getMyPoints();
      }
    )
  }

  deletePoint(row: PointsInterface) {
    let conf = confirm("Voulez vous supprimer ce point")
    if(!conf){
      return;
    }
    this.api.deletePoint(row.id!).subscribe({
      next:()=>{
        this.notify.snackMessage("Le point pour le sous-compte "+ row.scompte.sousCompteName
          +  " et l'opérateur "+ row.acces.name + " supprimé avec succès", 3000, 'success');
        this.getMyPoints();
      }
    })
  }

}
