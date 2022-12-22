import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent implements OnInit {

  constructor(public sbRef: MatSnackBarRef<DialogAlertComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
   }

}

