import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout.component';
import {RouterModule} from "@angular/router";
import {AdminLayoutRoutes} from "./admin-layout.routing";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {MatTableExporterModule} from "mat-table-exporter";
import {MonProfilComponent} from "../../dialog/mon-profil/mon-profil.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HighchartsChartModule} from "highcharts-angular";

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    MonProfilComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        MatListModule,
        MatIconModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatExpansionModule,
        MatToolbarModule,
        MatMenuModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatTableModule,
        MatButtonModule,
        MatDialogModule,
        MatSortModule,
        MatInputModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatCardModule,
        MatDatepickerModule,
        MatGridListModule,
        MatProgressBarModule,
        MatTableExporterModule,
        HighchartsChartModule
    ]
})
export class AdminLayoutModule { }
