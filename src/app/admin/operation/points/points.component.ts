import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {NotifyService} from "../../../service/utils/notify.service";
import {PointsInterface} from "../../../model/points.interface";
import {PointService} from "../../../service/PointService/point.service";
import {PointsDialogComponent} from "../../../dialog/points-dialog/points-dialog.component";

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {

  dataSource!: MatTableDataSource<PointsInterface>;
  columnsToDisplay = ['name', 'long', 'lat', 'sous-compte', 'acces', 'action'];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(private api: PointService,
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
    this.api.getMyPoints().subscribe(
      res => {
        console.log(res);
        this.dataSource = new MatTableDataSource<PointsInterface>(res.data as PointsInterface[]);
        console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
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
