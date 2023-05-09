import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AdminLayoutComponent} from "./admin/admin-layout/admin-layout.component";
import {ResetComponent} from "./reset/reset.component";

const routes: Routes = [
  {
    path : '',
    redirectTo : 'login',
    pathMatch: 'full',
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'reset',
    component : ResetComponent
  },
  {
    path : 'admin',
    component : AdminLayoutComponent,
    children : [
      {
        path : '',
        loadChildren : ()=> import('./admin/admin-layout/admin-layout.module').then(x => x.AdminLayoutModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
