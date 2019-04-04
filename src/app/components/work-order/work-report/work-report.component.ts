import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {ActivatedRoute, Router} from "@angular/router";
import {Workorder} from "../../../models/workorder";
import {WorkorderService} from "../../../services/workorder.service";
import {Asset} from "../../../models/asset";
import {AssetService} from "../../../services/asset.service";
import {BuildingService} from "../../../services/building.service";
import {Department} from "../../../models/department";
import {Resident} from "../../../models/resident";
import {Building} from "../../../models/building";
import {DepartmentService} from "../../../services/department.service";
import {ResidentService} from "../../../services/resident.service";
import {ErrorComponent} from "../../error/error.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-work-report',
  templateUrl: './work-report.component.html',
  styleUrls: ['./work-report.component.css']
})
export class WorkReportComponent implements OnInit,AfterViewInit {

  workOrderId:number;
  workOrder:Workorder;
  asset:Asset = {Id:null,name:'',type:'',model:'',serial:'',buildingId:null,buildingName:'',room:null};
  department:Department = {Id:null,name:'',subcontractor:''};
  resident:Resident = {Id:null,name:'',buildingId:null,buildingName:'',room:null,phone:''};
  building:Building = {Id:null,name:''};
  assetBuilding:string;
  residentBuilding:string;
  constructor(private _electronService:ElectronService,
              private route:ActivatedRoute,
              private workOrderService:WorkorderService,
              private assetService:AssetService,
              private departmentService:DepartmentService,
              private residentService:ResidentService,
              private buildingService:BuildingService,
              private router:Router,
              private _ngZone: NgZone,
              private dialog:MatDialog)
  {
    this._electronService.ipcRenderer.once('wrote-pdf', (event, arg) => {
      this._ngZone.run(() => {
        this.router.navigateByUrl('work-order');
      });
    });
    this._electronService.ipcRenderer.once('error', (event,error) => {
      this._ngZone.run(() => {
        console.log(error);
        this.dialog.open(ErrorComponent,{
          data:{
            title:"Error",
            body:"There is something wrong"
          }
        });
        this.router.navigateByUrl('work-order');
      });
    })
  }

  ngOnInit() {
    this.workOrderId = + this.route.snapshot.paramMap.get('id');

    this.workOrder = this.workOrderService.getWorkOrder(this.workOrderId);

    if(this.assetService.getAsset(this.workOrder.assetId)){
      this.asset = this.assetService.getAsset(this.workOrder.assetId);
    }

    if(this.buildingService.getBuildingById(this.asset.buildingId)){
      this.assetBuilding = this.buildingService.getBuildingById(this.asset.buildingId);
    }

    if(this.departmentService.getDepartment(this.workOrder.departmentId)){
      this.department = this.departmentService.getDepartment(this.workOrder.departmentId);
    }

    if(this.residentService.getResident(this.workOrder.residentId)){
      this.resident = this.residentService.getResident(this.workOrder.residentId);
    }

    if(this.buildingService.getBuildingById(this.resident.buildingId)){
      this.residentBuilding = this.buildingService.getBuildingById(this.resident.buildingId);
    }

    if(this.buildingService.getBuilding(this.workOrder.buildingId)){
      this.building = this.buildingService.getBuilding(this.workOrder.buildingId);
    }
    //first design the pdf file and checkout this is working in web or not.

  }
  onPrintReport()
  {
    this._electronService.ipcRenderer.send('print-to-pdf');
  }

  ngAfterViewInit(): void {
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style','display:none');
    this.onPrintReport();
  }

}
