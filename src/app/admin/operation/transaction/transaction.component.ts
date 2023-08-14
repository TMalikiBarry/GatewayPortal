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
import {StatutTransactionEnum, TransactionModel} from "../../../model/transaction.model";
import {UserModel} from "../../../model/user.model";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {


  listS = [
    "TOUS",
    "INITIATED",
    "SUCCESS",
    //"INTERNAL_ERROR",
    //"SERVICE_UNAVAILABLE",
    //"REQUEST_REJECTED",
    //"REQUEST_TOKEN_INVALID",
    //"PHONE_NUMBER_NOT_FOUND",
    //"REQUEST_VALIDATION_FAILED",
    //"TRANSACTION_ACCOUNT_NOT_DEFINED",
    //"INSUFFICIENT_BALANCE",
    //"INVALID_TRANSACTION_HEADER",
    //"REQUEST_PROCESSING_FAILED",
    //"BENEFICIARY_ACCOUNT_VALIDATION_FAILED",
    //"NON_UNIQUE_REQUEST_IDS",
    //"TRANSACTION_VALIDATION_FAILED",
    //"UNKNOWN_REQUEST_TYPE",
    //"TRANSACTION_LIMITS_EXCEEDED",
    "FAILED",
    "FINISHED",
    "DEFAULT"
  ]
  load : boolean = false
  map = new Map();
  displayedColumns: string[] = ['dateTransaction', 'point', 'service','expediteur', 'montant', 'typeTransaction', 'statut', 'destinataire'];
  dataSource !: MatTableDataSource<TransactionModel>;
  allTransactions !: TransactionModel[];

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
          this.allTransactions = res.data as TransactionModel[]
          this.dataSource = new MatTableDataSource(this.getStatut(this.allTransactions));
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.load = true;
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

  //TODO a revoir
  getStatut(transactions : TransactionModel[]) : TransactionModel[]{
    transactions.forEach(transaction => {
      switch (transaction.statut.toString()){
        case "SUCCESS":
          transaction.statut = StatutTransactionEnum.SUCCESS
          break;
        case "INITIATED":
          transaction.statut = StatutTransactionEnum.INITIATED
          break;
        default:
          transaction.statut = StatutTransactionEnum.FAILED
      }
    })
    return  transactions;
  }

  selectStatus(data : any){
    let filtre
    if(data.value === "TOUS" || data.value === ""){
      filtre = ''
    }else {
      filtre = data.value
    }
    this.dataSource.filter = filtre.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
