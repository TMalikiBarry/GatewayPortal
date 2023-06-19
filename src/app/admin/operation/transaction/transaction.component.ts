import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AuthService} from "../../../service/authService/auth.service";
import {ExportType, MatTableExporterDirective} from "mat-table-exporter";
import {ApiResponse} from "../../../request/ApiResponse";
import {TransactionService} from "../../../service/TransactionService/transaction.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogTransactionComponent} from "../../../dialog/dialog-transaction/dialog-transaction.component";
import {TransactionModel} from "../../../model/transaction.model";
import {UserModel} from "../../../model/user.model";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  displayedColumns: string[] = ['dateTransaction', 'scompte', 'service', 'montant', 'statut', 'typeTransaction', 'destinataire'];
  dataSource !: MatTableDataSource<TransactionModel>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatTableExporterDirective, {static: true}) exporter ?: MatTableExporterDirective;

  constructor(private apiTransaction: TransactionService, public authService: AuthService, public dialog: MatDialog) {
  }

  exportIt() {
    this.exporter?.exportTable(ExportType.XLS, {
      fileName: "transactions",
      Props: {
        Author: this.authService.currentUserValue.username
      }
    });
  }

  ngOnInit(): void {
    this.getTransaction()
  }

  removeUnderscore(input: string) {
    return input.replace(/_/g, ' ');
  }
  getTransaction() {
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.apiTransaction.getMyTransactions(myId)
      .subscribe({
        next: (res: ApiResponse) => {
          console.log(res.data)
          this.dataSource = new MatTableDataSource(res.data as TransactionModel[]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
  }

  addTransaction() {
    this.dialog.open(DialogTransactionComponent, {
      width: '80rem',
      maxHeight: '60rem',
    }).afterClosed().subscribe(
      () => {
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
}
