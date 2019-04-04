import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {ActivatedRoute, Router} from "@angular/router";
import {Resident} from "../../../models/resident";
import {Department} from "../../../models/department";
import {Asset} from "../../../models/asset";
import {Building} from "../../../models/building";
import {Projectorder} from "../../../models/projectorder";
import {AssetService} from "../../../services/asset.service";
import {DepartmentService} from "../../../services/department.service";
import {ResidentService} from "../../../services/resident.service";
import {BuildingService} from "../../../services/building.service";
import {ProjectorderService} from "../../../services/projectorder.service";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {Timeworked} from "../../../models/timeworked";
import {ErrorComponent} from "../../error/error.component";

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit,AfterViewInit {

  projectOrderId:number;
  projectOrder:Projectorder;
  asset:Asset = {Id:null,name:'',type:'',model:'',serial:'',buildingId:null,buildingName:'',room:null};
  department:Department = {Id:null,name:'',subcontractor:''};
  resident:Resident = {Id:null,name:'',buildingId:null,buildingName:'',room:null,phone:''};
  building:Building = {Id:null,name:''};
  assetBuilding:string;
  residentBuilding:string;

  displayedColumns = ['name','date','time-worked'];
  dataSource = new MatTableDataSource<Timeworked>();

  constructor(private _electronService:ElectronService,
              private route:ActivatedRoute,
              private projectOrderService:ProjectorderService,
              private assetService:AssetService,
              private departmentService:DepartmentService,
              private residentService:ResidentService,
              private buildingService:BuildingService,
              private router:Router,
              private _ngZone: NgZone,
              private dialog:MatDialog)
  {
    this._electronService.ipcRenderer.on('wrote-pdf', (event, arg) => {
      this._ngZone.run(() => {
        this.router.navigateByUrl('');
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
        this.router.navigateByUrl('');
      });
    })

  }
  ngOnInit() {
    this.projectOrderId = + this.route.snapshot.paramMap.get('id');

    this.projectOrder = this.projectOrderService.getProjectOrder(this.projectOrderId);

    if(this.assetService.getAsset(this.projectOrder.assetId)){
      this.asset = this.assetService.getAsset(this.projectOrder.assetId);
    }

    if(this.buildingService.getBuildingById(this.asset.buildingId)){
      this.assetBuilding = this.buildingService.getBuildingById(this.asset.buildingId);
    }

    if(this.departmentService.getDepartment(this.projectOrder.departmentId)){
      this.department = this.departmentService.getDepartment(this.projectOrder.departmentId);
    }

    if(this.residentService.getResident(this.projectOrder.residentId)){
      this.resident = this.residentService.getResident(this.projectOrder.residentId);
    }

    if(this.buildingService.getBuildingById(this.resident.buildingId)){
      this.residentBuilding = this.buildingService.getBuildingById(this.resident.buildingId);
    }

    if(this.buildingService.getBuilding(this.projectOrder.buildingId)){
      this.building = this.buildingService.getBuilding(this.projectOrder.buildingId);
    }
    this.dataSource.data = this.projectOrder.dateTimeWorked;

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
