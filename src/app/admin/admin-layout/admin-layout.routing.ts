import { Routes } from '@angular/router';
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {DashboardComponent} from "../dashboard/dashboard.component";

export enum ROLE {
  COMMERCANT = "COMMERCANT",
  SUPERVISEUR = "SUPERVISEUR",
  OPERATEUR = "OPERATEUR",
  PARTNER = 'PARTNER'
}

export const AdminLayoutRoutes: Routes = [
  {
    path : 'dashboard',
    component : DashboardComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT, ROLE.SUPERVISEUR]}
  },
  {
    path : 'acces',
    loadChildren: () => import('../securite/securite.module').then(m => m.SecuriteModule)
  },
  {
    path : 'param',
    loadChildren: () => import('../parametre/parametre.module').then(m => m.ParametreModule)
  },
  {
    path : 'transactions',
    loadChildren: () => import('../operation/operation.module').then(m => m.OperationModule)
  },
  {
    path : 'control',
    loadChildren: () => import('../control-transaction/control-transaction.module').then(m => m.ControlTransactionModule)
  }
];
