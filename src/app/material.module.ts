import {NgModule} from "@angular/core";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDialogModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatRadioModule,
  MatSelectModule,
  MatSidenavModule, MatSortModule,
  MatTableModule,
  MatToolbarModule
} from "@angular/material";

@NgModule({
  imports:[
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule,
    MatProgressBarModule],
  exports:[
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule,
    MatProgressBarModule]
})
export class MaterialModule {

}
