import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AuthService} from "../../../service/authService/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DemandeApproModel} from "../../../model/demandeAppro.model";
import {DialogDetailApproComponent} from "../../../dialog-detail/Approvisionnement/dialog-detail-appro.component";
import {DialogApproComponent} from "../../../dialog/demande/dialog-appro.component";
import {ApproScompteService} from "../../../service/approScompteService/appro-scompte.service";
import {CompteModel} from "../../../model/compte.model";
import {CompteService} from "../../../service/CompteService/compte.service";
import {map} from "rxjs/operators";
import {tap} from "rxjs";
import {ReseauModel} from "../../../model/reseau.model";

@Component({
  selector: 'app-approvisionnement',
  templateUrl: './approvisionnement.component.html',
  styleUrls: ['./approvisionnement.component.scss']
})
export class ApprovisionnementComponent implements OnInit {
  load : boolean = false
  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['dateAppro','scompte','montant','statut','action'] ;


  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private api : ApproScompteService,
              public authService : AuthService,
              private apiCompte : CompteService,
              public dialog : MatDialog) { }

  ngOnInit(): void {
    this.getAllApproScompteByCompteId()
  }

  getAllApproScompteByCompteId(){
    this.apiCompte.getMyCompte(this.authService.getId()).pipe(
      tap(console.dir),
      map(res => res.data as CompteModel[])
    ).subscribe({
      next : compte => {
        console.log(compte[0])
        this.api.getAllApproScompteByCompteId(compte[0].id)
          .subscribe({
            next: (res) => {
              console.log(res)
              this.dataSource = new MatTableDataSource(res.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.load = true;
            }
          })
      }
    });
  }

  detail(row : DemandeApproModel){
    this.dialog.open(DialogDetailApproComponent,{
      data : row,
      width : '50rem'
    }).afterClosed().subscribe(value => {
      console.log(value)
    })
  }

  // update(row : DemandeApproModel){
  //   console.log(row)
  //   this.dialog.open(DialogUserComponent,{
  //     data : row,
  //   }).afterClosed().subscribe(value => {
  //     if(value==='update'){
  //       this.getAllAppro();
  //     }
  //   })
  // }

  add(){
    this.dialog.open(DialogApproComponent,{
      data : false
    }).afterClosed().subscribe(value => {
      if(value==='save'){
        this.getAllApproScompteByCompteId();
      }
    })
  }

  // delete(row : DemandeApproModel){
  //   let conf = confirm("Etes vous sûr de vouloir supprimer l'utilisateur", )
  //   if(!conf){
  //     return;
  //   }
  //   this.api.deleteLogin(row.id).subscribe({
  //     next:()=>{
  //       this.getUser();
  //       this.notify.snackMessage(`Utilisateur ${row.name} supprimé avec Success`, 2000, "success")
  //     }
  //   })
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
