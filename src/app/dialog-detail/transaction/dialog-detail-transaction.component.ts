import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog-detail-transaction',
  templateUrl: './dialog-detail-transaction.component.html',
  styleUrls: ['./dialog-detail-transaction.component.scss']
})
export class DialogDetailTransactionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public row : any,
              private _snackBar : MatSnackBar,
              private dialogRef :MatDialogRef<DialogDetailTransactionComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.row)
  }

}
