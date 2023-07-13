import {Component, ViewChild} from '@angular/core';
import { map } from 'rxjs/operators';
import * as Highcharts from "highcharts";
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {ApiResponse} from "../../request/ApiResponse";
import {TransactionService} from "../../service/TransactionService/transaction.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserModel} from "../../model/user.model";
import {SousReseauxService} from "../../service/SousReseauService/sous-reseaux.service";
import {UserService} from "../../service/UserService/user.service";

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
            private apiTransaction : TransactionService,
            active : ActivatedRoute) {
}

ngOnInit(): void {
  this.getTransaction();
  this.getSousReseaux();
  this.getAcces();
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
      categories: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]
    },
    yAxis: {
      title: {
        text: ""
      }
    },
    series: [
      {
        name : 'Montant',
        data: [12, 8, 43, 35, 20, 90, 100, 110, 20, 18, 34,70],
        type : 'column'
      }
    ],
    legend : {
      enabled : false
    }
  }
}
