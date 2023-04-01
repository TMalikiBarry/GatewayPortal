import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ROLE} from "../admin-layout/admin-layout.routing";
import {TransactionComponent} from "./transaction/transaction.component";
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {SharedModule} from "../shared/shared.module";
import {MatStepperModule} from "@angular/material/stepper";
import {DialogTransactionComponent} from "../../dialog/dialog-transaction/dialog-transaction.component";

const TransactionRouting: Routes = [
  {
    path : '',
    pathMatch: 'full',
    component : TransactionComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  }
]

@NgModule({
  declarations: [
    TransactionComponent,
    DialogTransactionComponent
  ],
  imports: [
    SharedModule,
    MatStepperModule,
    RouterModule.forChild(TransactionRouting),
  ],
  providers: []
})
export class OperationModule { }
