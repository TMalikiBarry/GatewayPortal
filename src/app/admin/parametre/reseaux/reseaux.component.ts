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

@Component({
  selector: 'app-reseaux',
  templateUrl: './reseaux.component.html',
  styleUrls: ['./reseaux.component.scss']
})
export class ReseauxComponent implements OnInit {

  displayedColumns : string[] = ['code','name','categorie','action'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private apiReseau : ReseauxService, public authService : AuthService,public dialog : MatDialog) { }

  ngOnInit(): void {
    this.getReseau()
  }

  getReseau(){
    this.apiReseau.getAllReseau()
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

  add(){
    this.dialog.open(DialogReseauxComponent).afterClosed().subscribe(value => {
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
