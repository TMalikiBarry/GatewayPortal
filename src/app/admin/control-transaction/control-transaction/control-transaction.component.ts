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
import {AuthService} from "../../../service/authService/auth.service";
import {SousCompteService} from "../../../service/SousCompte/sous-compte.service";
import {SousCompteModel} from "../../../model/sousCompte.model";

@Component({
  selector: 'app-control-transaction',
  templateUrl: './control-transaction.component.html',
  styleUrls: ['./control-transaction.component.scss']
})
export class ControlTransactionComponent implements OnInit {

  isCommercant!: boolean;
  load : boolean = false
  table !: ControlTransactionInterface[]
  dataSource!: MatTableDataSource<ControlTransactionInterface>;
  columnsToDisplay = ['points', 'service', 'montant-seuil',
    'montant-hebdomadaire', 'montant-journalier', 'heure-debut', 'heure-fin', 'action'];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(private api: ControlTransactionService,
              private dialog: MatDialog,
              private apiScompte : SousCompteService,
              private auth : AuthService,
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
    if(this.auth.getRole() === 'SUPERVISEUR'){
      myId = (<UserModel>JSON.parse(localStorage.getItem('utilisateur')!)).idParent
    }
    this.api.getMyControlTransactions(myId).subscribe(
      res => {
        this.table = res.data as ControlTransactionInterface[]
        if(this.auth.getRole() === 'SUPERVISEUR') {
          this.apiScompte.getMySousComptes(myId).subscribe(
            resSC => {
              let scomptes = resSC.data as SousCompteModel[]
              let scomptSup = scomptes.find(scompte => scompte.accesCollection.find(acces => acces.id === this.auth.getId()))
              this.table = this.table.filter(control => control.point.scompte.id === scomptSup?.id)
              this.dataSource = new MatTableDataSource<ControlTransactionInterface>(this.table);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.load = true
            }
          )
        }else {
          this.dataSource = new MatTableDataSource<ControlTransactionInterface>(this.table);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.load = true
        }
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
