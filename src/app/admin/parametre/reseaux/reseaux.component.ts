import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ReseauxService} from "../../../service/reseauService/reseaux.service";
import {AuthService} from "../../../service/authService/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ApiResponse} from "../../../request/ApiResponse";
import {ReseauModel} from "../../../model/reseau.model";
import {DialogReseauxComponent} from "../../../dialog/Reseaux/dialog-reseaux.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserModel} from "../../../model/user.model";
import {DialogAccesReseauComponent} from "../../../dialog/ReseauAcces/dialog-acces-reseau.component";

@Component({
  selector: 'app-reseaux',
  templateUrl: './reseaux.component.html',
  styleUrls: ['./reseaux.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReseauxComponent implements OnInit {

  columnsToDisplay = ['code','name'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,'action', 'expand'];
  expandedElement ?: ReseauModel | null;

  dataSource !: MatTableDataSource<any>;
  dataSource1 !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator1 !: MatPaginator;
  @ViewChild(MatSort) sort1 !: MatSort;

  constructor(private apiReseau : ReseauxService, public authService : AuthService,public dialog : MatDialog) { }

  ngOnInit(): void {
    this.getReseau()
  }

  getReseau(){
    this.apiReseau.getAllReseau(this.authService.getId())
      .subscribe({
        next: (res : ApiResponse) => {
          console.log(res.data)
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
  }

  update(row : ReseauModel){
    this.dialog.open(DialogReseauxComponent,{
      data : row
    }).afterClosed().subscribe(value => {
      if(value==='update'){
        this.getReseau();
      }
    })
  }

  fetchTable(Users : UserModel[]){
    this.dataSource1 = new MatTableDataSource(Users);
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
  }
  add(){
    this.dialog.open(DialogReseauxComponent).afterClosed().subscribe(value => {
      if(value==='save'){
        this.getReseau();
      }
    })
  }
  addAccesToReseau(){
    this.dialog.open(DialogAccesReseauComponent).afterClosed().subscribe(value => {
      if(value==='save'){
        this.getReseau();
      }
    })
  }

  delete(id : number){
    let conf = confirm("Voulez Vous supprimer le reseau")
    if(!conf){
      return;
    }
    this.apiReseau.deleteReseau(id).subscribe({
      next:(res)=>{
        this.getReseau();
        alert("Reseau Supprimer avec Success")
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
}
