import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AuthService} from "../../../service/authService/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogUserComponent} from "../../../dialog/User/dialog-user.component";
import {ApprovisionnementService} from "../../../service/ApprovisionnementService/approvisionnement.service";
import {DialogApproComponent} from "../../../dialog/demande/dialog-appro.component";
import {DemandeApproModel} from "../../../model/demandeAppro.model";
import {DialogDetailApproComponent} from "../../../dialog-detail/Approvisionnement/dialog-detail-appro.component";

@Component({
  selector: 'app-approvisionnement',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss']
})
export class DemandeComponent implements OnInit {
  load : boolean = false
  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['dateTransaction','montant','statut','action'] ;


  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private api : ApprovisionnementService,
              public authService : AuthService,
              public dialog : MatDialog) { }

  ngOnInit(): void {
    this.getAllAppro()
  }

  getAllAppro(){
    this.api.getAppro(this.authService.getId())
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
      data : true
    }).afterClosed().subscribe(value => {
      if(value==='save'){
        this.getAllAppro();
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
