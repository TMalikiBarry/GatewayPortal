import { Routes } from '@angular/router';
import {AuthentificationGuard} from "../../service/guards/authentification.guard";
import {DashboardComponent} from "../dashboard/dashboard.component";

enum ROLE {
  GROSSISTE = "GROSSISTE",
  SUPERVISEUR = "SUPERVISEUR",
}
export const AdminLayoutRoutes: Routes = [
  {
    path : 'dashboard',
    component : DashboardComponent,
    canActivate: [AuthentificationGuard],
    data: {roles: [ROLE.GROSSISTE,ROLE.SUPERVISEUR]}
  }
];
