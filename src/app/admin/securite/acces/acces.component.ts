import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {DialogUserComponent} from "../../../dialog/User/dialog-user.component";
import {UserModel} from "../../../model/user.model";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserService} from "../../../service/UserService/user.service";
import {AuthService} from "../../../service/authService/auth.service";
import {NotifyService} from "../../../service/utils/notify.service";


@Component({
  selector: 'app-acces',
  templateUrl: './acces.component.html',
  styleUrls: ['./acces.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccesComponent implements OnInit {
  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['username','name', 'number','email','roles','action'];


  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private api : UserService,
              public authService : AuthService,
              public dialog : MatDialog,
              private notify: NotifyService) { }

  ngOnInit(): void {
    this.getUser()
  }

  getUser(){
    this.api.getAllUser(this.authService.getId())
      .subscribe({
        next: (res) => {
          console.log(res)
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
  }

  update(row : UserModel){
    console.log(row)
    this.dialog.open(DialogUserComponent,{
      data : row,
    }).afterClosed().subscribe(value => {
      if(value==='update'){
        this.getUser();
      }
    })
  }

  add(){
    this.dialog.open(DialogUserComponent).afterClosed().subscribe(value => {
      if(value==='save'){
        this.getUser();
      }
    })
  }

  delete(row : UserModel){
    let conf = confirm("Etes vous sûr de vouloir supprimer l'utilisateur", )
    if(!conf){
      return;
    }
    this.api.deleteLogin(row.id).subscribe({
      next:()=>{
        this.getUser();
        this.notify.snackMessage(`Utilisateur ${row.name} supprimé avec Success`, 2000, "success")
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
