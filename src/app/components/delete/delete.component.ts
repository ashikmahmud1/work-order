
import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector:'app-delete',
  template:`<h1 mat-dialog-title>Are you sure?</h1> 
  <mat-dialog-content>
    <p>you are deleting item with id {{passedData.id}}</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button [mat-dialog-close]="true">Yes</button>
    <button mat-button [mat-dialog-close]="false">No</button>
  </mat-dialog-actions>
  `
})
export class DeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any){}
}
