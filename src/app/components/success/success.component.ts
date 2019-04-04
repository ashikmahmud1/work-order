
import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector:'app-success',
  template:`<h1 mat-dialog-title style="text-align: center">{{passedData.title}}</h1> 
  <mat-dialog-content>
    <h2 style="text-align:center"><mat-icon>check_circle</mat-icon></h2>
    <p>{{passedData.body}}</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <div fxFlex fxLayoutAlign="end">
      <button mat-raised-button [mat-dialog-close]="true" color="primary">Ok</button>
    </div>
    
  </mat-dialog-actions>
  `,
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any){}
}
