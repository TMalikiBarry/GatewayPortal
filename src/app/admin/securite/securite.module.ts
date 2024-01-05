import { NgModule } from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {AccesComponent} from "./acces/acces.component";
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {ROLE} from "../admin-layout/admin-layout.routing";
import {DialogUserComponent} from "../../dialog/User/dialog-user.component";


const SecuriteRouting: Routes = [
  {
    path : '',
    pathMatch: 'full',
    component : AccesComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT, ROLE.SUPERVISEUR]}
  },
]

@NgModule({
  declarations: [
    DialogUserComponent,
    AccesComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(SecuriteRouting),
  ]
})
export class SecuriteModule { }
