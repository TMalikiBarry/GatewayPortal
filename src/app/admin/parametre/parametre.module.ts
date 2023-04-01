import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ReseauxComponent} from "./reseaux/reseaux.component";
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {ROLE} from "../admin-layout/admin-layout.routing";
import {SharedModule} from "../shared/shared.module";
import {DialogReseauxComponent} from "../../dialog/Reseaux/dialog-reseaux.component";
import {DialogAccesReseauComponent} from "../../dialog/ReseauAcces/dialog-acces-reseau.component";

const ParametreRouting: Routes = [
  {
    path : '',
    pathMatch: 'full',
    component : ReseauxComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  }
]

@NgModule({
  declarations: [
    ReseauxComponent,
    DialogReseauxComponent,
    DialogAccesReseauComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(ParametreRouting),
  ]
})
export class ParametreModule { }
