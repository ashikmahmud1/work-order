
import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector:'app-error',
  template:`<h1 mat-dialog-title style="text-align: center;color: #f44336;">{{passedData.title}}</h1>
  <mat-dialog-content>
    <h2 style="text-align:center;color: #f44336;;"><mat-icon>error_outline</mat-icon></h2>
    <p style="text-align: center">{{passedData.body}}</p>
    <p style="line-height: 22px">N.G. if you have previous print pdf<br>open, close that one.</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <div fxFlex fxLayoutAlign="end">
      <button mat-raised-button [mat-dialog-close]="true" color="primary">Ok</button>
    </div>

  </mat-dialog-actions>
  `
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any){}
}
