import { NgModule } from '@angular/core';
import { ControlTransactionComponent } from './control-transaction/control-transaction.component';
import {SharedModule} from "../shared/shared.module";
import {DialogControlTransComponent} from "../../dialog/controlTrans/dialog-control-trans.component";
import {RouterModule, Routes} from "@angular/router";
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {ROLE} from "../admin-layout/admin-layout.routing";

const CTransactRouting: Routes = [
  {
    path : '',
    pathMatch: 'full',
    component : ControlTransactionComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT, ROLE.SUPERVISEUR]}
  },
]

@NgModule({
  declarations: [
    ControlTransactionComponent,
    DialogControlTransComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(CTransactRouting),
  ]
})
export class ControlTransactionModule { }
