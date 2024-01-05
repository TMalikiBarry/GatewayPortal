import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DossierModel} from "../../model/dossier.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-dialog-detail-appro',
  templateUrl: './dialog-detail-appro.component.html',
  styleUrls: ['./dialog-detail-appro.component.scss']
})
export class DialogDetailApproComponent implements OnInit {

  data !: DossierModel
  title : string = "Detail Approvisionnement"
  httpURL = 'http://52.210.42.160:8085';
  httpsURL = 'https://dev-touch-ssii-api.gutouch.net';
  constructor(@Inject(MAT_DIALOG_DATA) public row: any,
              private _snackBar: MatSnackBar,
              private http: HttpClient,
              private dialogRef: MatDialogRef<DialogDetailApproComponent>
  ) {
  }

  ngOnInit(): void {
    if(this.row.evidence){
      this.data = this.row.evidence;
      this.title = "Detail Demande Approvisionnement"
    }
  }
  protectedURL(): string {
    return this.data.uploadingFile.replace(this.httpURL, this.httpsURL);
  }

  onDownLoad() {
    let fileName = this.data.name;
    this.http.get(`${environment.API_URL}/dossier/getFile/${fileName}`
      , {
        observe: 'response',
        responseType: 'blob'
      }).subscribe({
      next: response => {
        saveAs(response.body!, fileName);
      }
    })
  }
}
