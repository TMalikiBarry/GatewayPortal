import {Component, ViewChild} from '@angular/core';
import { map } from 'rxjs/operators';
import * as Highcharts from "highcharts";
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {MatTableDataSource} from "@angular/material/table";
import {ApiResponse} from "../../request/ApiResponse";
import {TransactionService} from "../../service/TransactionService/transaction.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserModel} from "../../model/user.model";
import {SousReseauxService} from "../../service/SousReseauService/sous-reseaux.service";
import {UserService} from "../../service/UserService/user.service";
import {TransactionModel} from "../../model/transaction.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  dataSourceTransaction !: MatTableDataSource<any>;
  dataSourceSousReseau !: MatTableDataSource<any>;
  dataSourceAcces !: MatTableDataSource<any>;
  displayedColumnsSousReseau : string[]  = ['code','sousReseauName'];
  displayedColumnsAcces : string[]  = ['name','number','roles'];
  displayedColumnsTrans : string[]  = ['dateTransaction','scompte','service','expeditaire','destinataire','typeTransaction','statut'];
  transactionsCount !: number;
  sousReseauCount !: number;
  accesCount !: number;

  AllTransactions !: TransactionModel[]

  jav : number = 0
  fev : number = 0
  mars : number = 0
  avr : number = 0
  mai : number = 0
  juin : number = 0
  juil : number = 0
  aout : number = 0
  sep : number = 0
  oct : number = 0
  nov : number = 0
  dec : number = 0

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Statistique Transactions',chart : this.highchartsTransactions, options : this.chartOptionsTransaction },
        ];
      }

      return [
        { title: 'Statistique Transactions', chart: this.highchartsTransactions, options : this.chartOptionsTransaction },
      ];
    })
  );

constructor(private breakpointObserver: BreakpointObserver,
            private apiSousReseau : SousReseauxService,
            private apiAcces : UserService,
            private apiTransaction : TransactionService) {
}

ngOnInit(): void {
  this.getTransaction();
  this.getSousReseaux();
  this.getAcces();
  this.getAllTransactionSuccess()
}

  getAllTransactionSuccess(){
    this.apiTransaction.getAllTransactionSuccess()
      .subscribe(res => {
        this.AllTransactions = res.data as TransactionModel[]
        this.filtreTransaction(this.AllTransactions)

        this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
          map(({ matches }) => {
            if (matches) {
              return [
                { title: 'Statistique Transactions',chart : this.highchartsTransactions, options : this.chartOptionsTransaction },
              ];
            }

            return [
              { title: 'Statistique Transactions', chart: this.highchartsTransactions, options : this.chartOptionsTransaction },
            ];
          })
        );
      })
  }

  filtreTransaction(transactions : TransactionModel[]){
    transactions.forEach(transaction => {
      let month = new Date(transaction.dateModification!).getMonth()
      switch (month){
        case 0 :
          this.jav += transaction.montant
          break
        case 1:
          this.fev += transaction.montant
          break
        case 2:
          this.mars += transaction.montant
          break
        case 3:
          this.avr += transaction.montant
          break
        case 4:
          this.mai += transaction.montant
          break
        case 5:
          this.juin += transaction.montant
          break
        case 6:
          this.juil += transaction.montant
          break
        case 7:
          this.aout += transaction.montant
          break
        case 8:
          this.sep += transaction.montant
          break
        case 9:
          this.oct += transaction.montant
          break
        case 10:
          this.nov += transaction.montant
          break
        case 11:
          this.dec += transaction.montant
          break
      }
    })
    // @ts-ignore
    this.chartOptionsTransaction.series[0].data = [
      this.jav,
      this.fev,
      this.mars,
      this.avr,
      this.mai,
      this.juin,
      this.juil,
      this.aout,
      this.sep,
      this.oct,
      this.nov,
      this.dec
    ]
  }

  getAcces(){
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.apiAcces.getAllUser(myId)
      .subscribe({
        next : (res : ApiResponse) => {
          console.log(res.data)
          this.accesCount = res.data.length
          // recuperer les 4 premiers elements de la table
          let tab = res.data.splice(0,4);
          this.dataSourceAcces = new MatTableDataSource(tab);
          this.dataSourceAcces.paginator = this.paginator;
          this.dataSourceAcces.sort = this.sort;
        }
      })
  }

  getSousReseaux(){
    this.apiSousReseau.getMySousReseaux()
      .subscribe({
        next : (res : ApiResponse) => {
          console.log(res.data)
          this.sousReseauCount = res.data.length
          // recuperer les 4 premiers elements de la table
          let tab = res.data.splice(0,4);
          this.dataSourceSousReseau = new MatTableDataSource(tab);
          this.dataSourceSousReseau.paginator = this.paginator;
          this.dataSourceSousReseau.sort = this.sort;
        }
      })
  }
  getTransaction(){
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.apiTransaction.getMyTransactions(myId)
      .subscribe({
        next: (res : ApiResponse) => {
          console.log(res.data)
          this.transactionsCount = res.data.length
          // recuperer les 4 premier elements de la table
          let tab = res.data.splice(0,4);
          this.dataSourceTransaction = new MatTableDataSource(tab);
          this.dataSourceTransaction.paginator = this.paginator;
          this.dataSourceTransaction.sort = this.sort;
        }
      })
  }

  highchartsTransactions = Highcharts;

  chartOptionsTransaction: Highcharts.Options = {
    chart : {
      type : 'column',
      width : 750,
      height : 500
    },
    credits : {
      enabled: false
    },
    title: {
      text: "Statistiques des Transactions"
    },
    xAxis: {
      categories: [
        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre"
      ]
    },
    yAxis: {
      title: {
        text: ""
      }
    },
    series: [
      {
        name : 'Montant',
        data: [
          this.jav,
          this.fev,
          this.mars,
          this.avr,
          this.mai,
          this.juin,
          this.juil,
          this.aout,
          this.sep,
          this.oct,
          this.nov,
          this.dec
        ],
        type : 'column'
      }
    ],
    legend : {
      enabled : false
    }
  }
}
