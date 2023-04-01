import {Component, OnInit, ViewChild} from '@angular/core';
import {ControlTransactionService} from "../../../service/controlTransaction/control-transaction.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {ControlTransactionInterface} from "../../../model/control-transaction.interface";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserModel} from "../../../model/user.model";
import {DialogControlTransComponent} from "../../../dialog/controlTrans/dialog-control-trans.component";
import {NotifyService} from "../../../service/utils/notify.service";

@Component({
  selector: 'app-control-transaction',
  templateUrl: './control-transaction.component.html',
  styleUrls: ['./control-transaction.component.scss']
})
export class ControlTransactionComponent implements OnInit {

  dataSource!: MatTableDataSource<ControlTransactionInterface>;
  columnsToDisplay = ['sous-compte', 'service', 'montant-seuil',
    'montant-journalier', 'montant-hebdomadaire', 'heure-debut', 'heure-fin']
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(private api: ControlTransactionService,
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
    this.getMyControlTransactions();
  }

  getMyControlTransactions(){
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.api.getMyControlTransactions(myId).subscribe(
      res => {
        this.dataSource = new MatTableDataSource<ControlTransactionInterface>(res.data as ControlTransactionInterface[]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  addAControl() {
    this.dialog.open(DialogControlTransComponent, {
      width: '50rem',
    }).afterClosed().subscribe(
      (res) => {
        if (res === 'OK')
          this.getMyControlTransactions();
      }
    )
  }

  updateControl(row: ControlTransactionInterface) {
    this.dialog.open(DialogControlTransComponent, {
      width: '50rem',
      data: row
    }).afterClosed().subscribe(
      (res) => {
        if (res === 'OK')
          this.getMyControlTransactions();
      }
    )
  }

  deleteControl(row: ControlTransactionInterface) {
    let conf = confirm("Voulez vous supprimer ce contrôle")
    if(!conf){
      return;
    }
    this.api.deleteControlTransaction(row.id!).subscribe({
      next:()=>{
        this.notify.snackMessage("Contrôle de transaction pour le sous-compte "+ row.sCompte.sousCompteName
        +  " et le service "+ row.service.serviceName+ " supprimé avec Success", 3000, 'success');
        this.getMyControlTransactions();
      }
    })
  }
}
