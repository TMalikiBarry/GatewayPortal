import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { DialogAlertComponent } from "./dialog/SnackBar/dialog-alert.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import {ErrorInterceptor} from "./helpers/error.interceptor";
import {JwtInterceptor} from "./helpers/jwt.interceptor";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {DialogUserComponent} from "./dialog/User/dialog-user.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { DialogReseauxComponent } from './dialog/Reseaux/dialog-reseaux.component';
import {MatSelectModule} from "@angular/material/select";
import { DialogAccesReseauComponent } from './dialog/ReseauAcces/dialog-acces-reseau.component';
import {MatTableExporterModule} from "mat-table-exporter";
import { MonProfilComponent } from './dialog/mon-profil/mon-profil.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { DialogTransactionComponent } from './dialog/dialog-transaction/dialog-transaction.component';
import {MatStepperModule} from "@angular/material/stepper";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogAlertComponent,
    DialogUserComponent,
    DialogReseauxComponent,
    DialogAccesReseauComponent,
    MonProfilComponent,
    DialogTransactionComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatDialogModule,
        MatMenuModule,
        MatStepperModule,
        MatIconModule,
        HttpClientModule,
        MatSnackBarModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatTableExporterModule
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor,multi: true },
    { provide: MAT_SNACK_BAR_DATA, useValue: {} },
    { provide: MatSnackBarRef, useValue: {} },
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
