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

  isCommercant!: boolean;
  load : boolean = false
  dataSource!: MatTableDataSource<ControlTransactionInterface>;
  columnsToDisplay = ['points', 'service', 'montant-seuil',
    'montant-hebdomadaire', 'montant-journalier', 'heure-debut', 'heure-fin', 'action'];
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
    this.isCommercant = localStorage.getItem('ROLE')?.toString() === "COMMERCANT";
    this.getMyControlTransactions();
  }

  getMyControlTransactions(){
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.api.getMyControlTransactions(myId).subscribe(
      res => {
        console.log(res)
        this.dataSource = new MatTableDataSource<ControlTransactionInterface>(res.data as ControlTransactionInterface[]);
        console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.load = true
      }
    )
  }

  addAControl() {
    this.dialog.open(DialogControlTransComponent, {
      width: '35rem',
    }).afterClosed().subscribe(
      (res) => {
        if (res === 'OK')
          this.getMyControlTransactions();
      }
    )
  }

  updateControl(row: ControlTransactionInterface) {
    this.dialog.open(DialogControlTransComponent, {
      width: '35rem',
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
        this.notify.snackMessage("Contrôle de transaction pour le sous-compte "+ row.point.name
        +  " et le service "+ row.service.serviceName+ " supprimé avec Success", 3000, 'success');
        this.getMyControlTransactions();
      }
    })
  }

  formatTime(value: string) {
    let timeInfos = value.split(':').slice(0, 2);
    return `${timeInfos[0]}h ${timeInfos[1]}min`;
  }
}
