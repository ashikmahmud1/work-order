import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {Workorder} from "../../../models/workorder";
import {WorkorderService} from "../../../services/workorder.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Department} from "../../../models/department";
import {Building} from "../../../models/building";
import {Worker} from "../../../models/worker";
import {Resident} from "../../../models/resident";
import {Asset} from "../../../models/asset";
import {ResidentService} from "../../../services/resident.service";
import {DepartmentService} from "../../../services/department.service";
import {WorkerService} from "../../../services/worker.service";
import {AssetService} from "../../../services/asset.service";
import {BuildingService} from "../../../services/building.service";
import {ElectronService} from "ngx-electron";
import {ErrorComponent} from "../../error/error.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-print-work-order',
  templateUrl: './print-work-order.component.html',
  styleUrls: ['./print-work-order.component.css']
})
export class PrintWorkOrderComponent implements OnInit,AfterViewInit {

  workOrder:Workorder;
  pageName:string;
  buildings:Building[];
  assets:Asset[];
  residents:Resident[];
  departments:Department[];
  workers:Worker[];

  isBuilding:boolean = false;
  isResident:boolean = false;

  statuss = [
    {value: 'Open', viewValue: 'Open'},
    {value: 'Closed', viewValue: 'Closed'}
  ];
  constructor(private workOrderService:WorkorderService,
              private residentService:ResidentService,
              private assetService:AssetService,
              private buildingService:BuildingService,
              private departmentService:DepartmentService,
              private workerService:WorkerService,
              private route:ActivatedRoute,
              private _electronService:ElectronService,
              private _ngZone: NgZone,
              private dialog:MatDialog,
              private router:Router)
  {
    this._electronService.ipcRenderer.on('wrote-pdf', (event) => {
      this._ngZone.run(() => {
        if (this.pageName === "new-work-order"){
          this.router.navigateByUrl(this.pageName);
        }
        else {
          this.router.navigate(['/edit-work-order',this.workOrder.Id]);
        }
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
        if (this.pageName === "new-work-order"){
          this.router.navigateByUrl(this.pageName);
        }
        else {
          this.router.navigate(['/edit-work-order',this.workOrder.Id]);
        }
      });
    })
  }

  ngOnInit() {
    this.pageName = this.route.snapshot.paramMap.get('name');
    this.workOrder = this.workOrderService.printWorkOrder;
    this.residents = this.residentService.getResidents();
    this.assets = this.assetService.getAssets();
    this.buildings = this.buildingService.getBuildings();
    this.departments = this.departmentService.getDepartments();
    this.workers = this.workerService.getWorkers();
    //undefined check otherwise it might produce error.
    this.isBuilding = (typeof this.workOrder.buildingCheck !="undefined") ? this.workOrder.buildingCheck : false;
    this.isResident = (typeof this.workOrder.residentCheck !="undefined") ? this.workOrder.residentCheck : false;
  }
  onPrintWorkOrder(){
    this._electronService.ipcRenderer.send('print-to-pdf');
  }
  ngAfterViewInit(): void {
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style','display:none');
    this.onPrintWorkOrder();
  }

}
