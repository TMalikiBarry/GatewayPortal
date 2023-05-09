import {Component, NgZone, OnInit} from '@angular/core';
import {LoginModel} from "../../model/login.model";
import {AuthService} from "../../service/authService/auth.service";
import {Router} from "@angular/router";
import {navbarData} from "./nav-data";
import {MonProfilComponent} from "../../dialog/mon-profil/mon-profil.component";
import {MatDialog} from "@angular/material/dialog";
import {ResetComponent} from "../../reset/reset.component";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {


  width ?: number;
  height ?: number;
  mode : any ='side';
  open = true;
  opened ?: boolean;
  title = 'Bank Gateway';
  navList: NavList[] = [];
  user !: LoginModel;
  roles !: string[];

  constructor(public authService : AuthService,
              private router : Router,
              public ngZone: NgZone,
              private dialog : MatDialog) {
    navbarData.forEach(menubar => {
      menubar.roles.forEach(role => {
        if(authService.getRole() === role){
          this.navList.push(menubar)
        }
      });
    })
    this.changeMode();
    window.onresize = () => {
      ngZone.run(() => {
        this.changeMode();
      });
    };
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.user = this.authService.currentUserValue;
    }
  }


  changeMode() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.width <= 800) {
      this.mode = 'over';
      this.open = false;
    }
    if (this.width > 800) {
      this.mode = 'side';
      this.open = false;
    }
  }

  onUpdateProfil() {
    this.dialog.open(MonProfilComponent, {
      width:'30rem',
      maxHeight: '40rem',
    })
  }

  changePasse() {
    this.dialog.open(ResetComponent, {
      data : this.user
    })
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next : ()=>{
          this.router.navigateByUrl("/login")
        }
      })
  }

}
export class NavList {
  routerLink ?: string;
  icon ?: string;
  label ?: string;
  dropDown ?: boolean;
  items ?: NavListItem[];
  constructor(_routerLink: string, _icon: string, _label: string, _dropDown: boolean, _items: NavListItem[]) {
    this.routerLink = _routerLink;
    this.icon = _icon;
    this.label = _label;
    this.dropDown = _dropDown;
    this.items = _items;
  }
}

export class NavListItem {
  routerLink ?: string;
  icon ?: string;
  label ?: string ;
  visible ?: boolean;
}
