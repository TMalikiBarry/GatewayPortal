import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AuthService} from "../../../service/authService/auth.service";
import {ExportType, MatTableExporterDirective} from "mat-table-exporter";
import {ApiResponse} from "../../../request/ApiResponse";
import {TransactionService} from "../../../service/TransactionService/transaction.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogTransactionComponent} from "./dialog-transaction/dialog-transaction.component";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  displayedColumns : string[] = ['dateTransaction','scompte','service','montant','statut','commission','typeTransaction','destinataire'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter ?: MatTableExporterDirective;
  exportIt() {
    this.exporter?.exportTable(ExportType.XLS, {
      fileName: "transactions",
      Props: {
        Author: this.authService.currentUserValue.username
      }
    });
  }

  constructor(private apiTransaction : TransactionService, public authService : AuthService,public dialog : MatDialog) { }

  ngOnInit(): void {
    this.getTransaction()
  }

  getTransaction(){
    this.apiTransaction.getAllTransaction()
      .subscribe({
        next: (res : ApiResponse) => {
          console.log(res.data)
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
  }

  addTransaction() {
    this.dialog.open(DialogTransactionComponent, {
      minWidth: '60rem',
      minHeight: '30rem',
    }).afterClosed().subscribe(
      res => {
        if (res)
          this.getTransaction();
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // update(row : TransactionModel){
  //   this.dialog.open(DialogTransactionComponent,{
  //     data : row
  //   }).afterClosed().subscribe(value => {
  //     if(value==='update'){
  //       this.getTransaction();
  //     }
  //   })
  // }
  //
  // add(){
  //   this.dialog.open(DialogTransactionComponent).afterClosed().subscribe(value => {
  //     if(value==='save'){
  //       this.getTransaction();
  //     }
  //   })
  // }
  //
  // delete(id : number){
  //   let conf = confirm("Voulez Vous supprimer la transaction")
  //   if(!conf){
  //     return;
  //   }
  //   this.apiTransaction.deleteTransaction(id).subscribe({
  //     next:(res)=>{
  //       this.getTransaction();
  //       alert("Transaction Supprimer avec Success")
  //     }
  //   })
  // }
}
