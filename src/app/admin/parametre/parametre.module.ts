import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SousReseauxComponent} from "./sous-reseaux/sous-reseaux.component";
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {ROLE} from "../admin-layout/admin-layout.routing";
import {SharedModule} from "../shared/shared.module";
import {DialogSousReseauxComponent} from "../../dialog/Sous-Reseaux/dialog-sous-reseaux.component";
import {DialogAccesSCompteComponent} from "../../dialog/SousCompteAcces/dialog-acces-s-compte.component";
import { SousComptesComponent } from './sous-comptes/sous-comptes.component';
import { DialogSousCompteComponent } from '../../dialog/SousCompte/dialog-sous-compte.component';

const ParametreRouting: Routes = [
  {
    path : 'sous-reseaux',
    pathMatch: 'full',
    component : SousReseauxComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  },
  {
    path : 'sous-comptes',
    pathMatch: 'full',
    component : SousComptesComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  }
]

@NgModule({
  declarations: [
    SousReseauxComponent,
    DialogSousReseauxComponent,
    DialogAccesSCompteComponent,
    SousComptesComponent,
    DialogSousCompteComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(ParametreRouting),
  ]
})
export class ParametreModule { }
