
import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector:'app-edit',
  template:`<h1 mat-dialog-title>Are you sure?</h1> 
  <mat-dialog-content>
    <h4>you want to edit the item?</h4>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button [mat-dialog-close]="true">Yes</button>
    <button mat-button [mat-dialog-close]="false">No</button>
  </mat-dialog-actions>
  `
})
export class EditComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any){}
}
