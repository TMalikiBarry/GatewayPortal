import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ROLE} from "../admin-layout/admin-layout.routing";
import {TransactionComponent} from "./transaction/transaction.component";
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {SharedModule} from "../shared/shared.module";
import {MatStepperModule} from "@angular/material/stepper";
import {DialogTransactionComponent} from "../../dialog/dialog-transaction/dialog-transaction.component";
import {PointsComponent} from './points/points.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DemandeComponent} from './demande/demande.component';
import { ApprovisionnementComponent } from './approvisionnement/approvisionnement.component';

const TransactionRouting: Routes = [
  {
    path : 'transac',
    pathMatch: 'full',
    component : TransactionComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT]}
  },
  {
    path : 'points',
    pathMatch: 'full',
    component : PointsComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  },
  {
    path: 'demande',
    pathMatch: "full",
    component : DemandeComponent,
    canActivate : [AuthentificationGuard],
    data : {roles: [ROLE.COMMERCANT]}
  },
  {
    path: 'approvisionnement',
    pathMatch: 'full',
    component : ApprovisionnementComponent,
    canActivate : [AuthentificationGuard],
    data : {roles : [ROLE.COMMERCANT]}
  }
]

@NgModule({
  declarations: [
    TransactionComponent,
    DialogTransactionComponent,
    PointsComponent,
    DemandeComponent,
    ApprovisionnementComponent
  ],
    imports: [
        SharedModule,
        MatStepperModule,
        RouterModule.forChild(TransactionRouting),
        MatProgressSpinnerModule,
    ],
  providers: []
})
export class OperationModule { }
