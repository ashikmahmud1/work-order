import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialModule} from "./material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { WorkOrderComponent } from './components/work-order/work-order.component';
import { ProjectOrderComponent } from './components/project-order/project-order.component';
import { NewWorkOrderComponent } from './components/work-order/new-work-order/new-work-order.component';
import { NewProjectOrderComponent } from './components/project-order/new-project-order/new-project-order.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {RouterModule, Routes} from "@angular/router";
import { ResidentComponent } from './components/resident/resident.component';
import { WorkerComponent } from './components/worker/worker.component';
import { DepartmentComponent } from './components/department/department.component';
import { AssetComponent } from './components/asset/asset.component';
import { NewAssetComponent } from './components/asset/new-asset/new-asset.component';
import { NewDepartmentComponent } from './components/department/new-department/new-department.component';
import { NewWorkerComponent } from './components/worker/new-worker/new-worker.component';
import { NewResidentComponent } from './components/resident/new-resident/new-resident.component';
import {ResidentService} from "./services/resident.service";
import {FormsModule} from "@angular/forms";
import {DepartmentService} from "./services/department.service";
import {WorkerService} from "./services/worker.service";
import {AssetService} from "./services/asset.service";
import {DeleteComponent} from "./components/delete/delete.component";
import {WorkorderService} from "./services/workorder.service";
import {ProjectorderService} from "./services/projectorder.service";
import {BuildingService} from "./services/building.service";
import { EditWorkerComponent } from './components/worker/edit-worker/edit-worker.component';
import { EditResidentComponent } from './components/resident/edit-resident/edit-resident.component';
import { EditAssetComponent } from './components/asset/edit-asset/edit-asset.component';
import { EditDepartmentComponent } from './components/department/edit-department/edit-department.component';
import { EditProjectOrderComponent } from './components/project-order/edit-project-order/edit-project-order.component';
import { EditWorkOrderComponent } from './components/work-order/edit-work-order/edit-work-order.component';
import {EditComponent} from "./components/edit/edit.component";
import { BuildingComponent } from './components/building/building.component';
import { NewBuildingComponent } from './components/building/new-building/new-building.component';
import { EditBuildingComponent } from './components/building/edit-building/edit-building.component';
import {NgxElectronModule} from "ngx-electron";
import { ProjectReportComponent } from './components/project-order/project-report/project-report.component';
import { WorkReportComponent } from './components/work-order/work-report/work-report.component';
import {DatePipe} from "@angular/common";
import { SettingsComponent } from './components/settings/settings.component';
import {SuccessComponent} from "./components/success/success.component";
import {ErrorComponent} from "./components/error/error.component";
import { PrintWorkOrderComponent } from './components/work-order/print-work-order/print-work-order.component';
import { PrintProjectOrderComponent } from './components/project-order/print-project-order/print-project-order.component';
import { StaffTimeWorkedComponent } from './components/report/staff-time-worked/staff-time-worked.component';
import { AverageDaysCompleteWorkOrdersComponent } from './components/report/average-days-complete-work-orders/average-days-complete-work-orders.component';
import { AverageDaysCompleteWorkOrdersByPropertyComponent } from './components/report/average-days-complete-work-orders-by-property/average-days-complete-work-orders-by-property.component';
import {WarningComponent} from "./components/warning/warning.component";
import { AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent } from './components/report/average-days-complete-work-orders-by-property-department/average-days-complete-work-orders-by-property-department.component';
import { FullWorkOrderComponent } from './components/report/full-work-order/full-work-order.component';
import { FullWorkOrderPrintComponent } from './components/report/full-work-order-print/full-work-order-print.component';

const appRoutes:Routes = [
  {path:'',component:ProjectOrderComponent},
  {path:'new-project-order',component:NewProjectOrderComponent},
  {path:'work-order',component:WorkOrderComponent},
  {path:'new-work-order',component:NewWorkOrderComponent},
  {path:'asset',component:AssetComponent},
  {path:'department',component:DepartmentComponent},
  {path:'building',component:BuildingComponent},
  {path:'resident',component:ResidentComponent},
  {path:'worker',component:WorkerComponent},
  {path:'settings',component:SettingsComponent},
  {path:'new-asset',component:NewAssetComponent},
  {path:'new-department',component:NewDepartmentComponent},
  {path:'new-resident',component:NewResidentComponent},
  {path:'new-worker',component:NewWorkerComponent},
  {path:'new-building',component:NewBuildingComponent},
  {path:'edit-worker/:id',component:EditWorkerComponent},
  {path:'edit-work-order/:id',component:EditWorkOrderComponent},
  {path:'edit-project-order/:id',component:EditProjectOrderComponent},
  {path:'edit-asset/:id',component:EditAssetComponent},
  {path:'edit-resident/:id',component:EditResidentComponent},
  {path:'edit-department/:id',component:EditDepartmentComponent},
  {path:'edit-building/:id',component:EditBuildingComponent},
  {path:'project-report/:id',component:ProjectReportComponent},
  {path:'work-report/:id',component:WorkReportComponent},
  {path:'print-work-order/:name',component:PrintWorkOrderComponent},
  {path:'full-work-order',component:FullWorkOrderComponent},
  {path:'full-work-order-print',component:FullWorkOrderPrintComponent},
  {path:'print-project-order/:name',component:PrintProjectOrderComponent},
  {path:'staff-time-worked',component:StaffTimeWorkedComponent},
  {path:'average-days-complete-work-orders',component:AverageDaysCompleteWorkOrdersComponent},
  {path:'average-days-complete-work-orders-by-property',component:AverageDaysCompleteWorkOrdersByPropertyComponent},
  {path:'average-days-complete-work-orders-by-property-department',component:AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    WorkOrderComponent,
    ProjectOrderComponent,
    NewWorkOrderComponent,
    NewProjectOrderComponent,
    NavbarComponent,
    ResidentComponent,
    WorkerComponent,
    DepartmentComponent,
    AssetComponent,
    NewAssetComponent,
    NewDepartmentComponent,
    NewWorkerComponent,
    NewResidentComponent,
    EditWorkerComponent,
    EditResidentComponent,
    EditAssetComponent,
    EditDepartmentComponent,
    EditProjectOrderComponent,
    EditWorkOrderComponent,
    BuildingComponent,
    NewBuildingComponent,
    EditBuildingComponent,
    ProjectReportComponent,
    WorkReportComponent,
    SettingsComponent,
    DeleteComponent,
    EditComponent,
    SuccessComponent,
    ErrorComponent,
    WarningComponent,
    PrintWorkOrderComponent,
    PrintProjectOrderComponent,
    StaffTimeWorkedComponent,
    AverageDaysCompleteWorkOrdersComponent,
    AverageDaysCompleteWorkOrdersByPropertyComponent,
    AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent,
    FullWorkOrderComponent,
    FullWorkOrderPrintComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    NgxElectronModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    ResidentService,
    DepartmentService,
    WorkerService,
    AssetService,
    WorkorderService,
    ProjectorderService,
    BuildingService,
    DatePipe],
  bootstrap: [AppComponent],
  entryComponents:[DeleteComponent,EditComponent,SuccessComponent,ErrorComponent,WarningComponent]
})
export class AppModule { }
