import { Routes } from '@angular/router';
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {AccesComponent} from "../securite/acces/acces.component";
import {ReseauxComponent} from "../parametre/reseaux/reseaux.component";
import {TransactionComponent} from "../operation/transaction/transaction.component";

enum ROLE {
  COMMERCANT = "COMMERCANT",
  SUPERVISEUR = "SUPERVISEUR",
}
export const AdminLayoutRoutes: Routes = [
  {
    path : 'dashboard',
    component : DashboardComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  },
  {
    path : 'acces',
    component : AccesComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT]}
  },
  {
    path : 'reseaux',
    component : ReseauxComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  },
  {
    path : 'transactions',
    component : TransactionComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.COMMERCANT,ROLE.SUPERVISEUR]}
  }
];
