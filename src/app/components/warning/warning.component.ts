
import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector:'app-warning',
  template:`<h1 mat-dialog-title style="text-align: center;color: #f44336;">Are you sure?</h1>
  <mat-dialog-content>
    <h2 style="text-align:center;color: #f44336;;"><mat-icon>error_outline</mat-icon></h2>
    <p style="text-align: center;line-height: 25px">Be careful All your data will be removed.<br>Backup your data before removed</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <div fxFlex fxLayoutAlign="end">
      <button mat-raised-button [mat-dialog-close]="true" color="warn">Yes</button>
      <button mat-raised-button [mat-dialog-close]="false" color="primary">No</button>
    </div>

  </mat-dialog-actions>
  `
})
export class WarningComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any){}
}
