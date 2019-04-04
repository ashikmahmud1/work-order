import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Workorder} from "../../../models/workorder";
import {Resident} from "../../../models/resident";
import {Building} from "../../../models/building";
import {Asset} from "../../../models/asset";
import {ResidentService} from "../../../services/resident.service";
import {AssetService} from "../../../services/asset.service";
import {BuildingService} from "../../../services/building.service";
import {WorkorderService} from "../../../services/workorder.service";
import {EditComponent} from "../../edit/edit.component";
import {MatDialog} from "@angular/material";
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";
import {Worker} from "../../../models/worker";
import {WorkerService} from "../../../services/worker.service";
import {Timeworked} from "../../../models/timeworked";

@Component({
  selector: 'app-edit-work-order',
  templateUrl: './edit-work-order.component.html',
  styleUrls: ['./edit-work-order.component.css']
})
export class EditWorkOrderComponent implements OnInit, AfterViewInit {

  workOrderId: number;
  workOrder: Workorder;
  buildings: Building[];
  assets: Asset[];
  residents: Resident[];
  departments: Department[];
  workers: Worker[];
  workersTimeWorked:Timeworked[] = [];
  timeWorked:Timeworked;

  isBuilding: boolean = false;
  isResident: boolean = false;

  statuss = [
    {value: 'Open', viewValue: 'Open'},
    {value: 'Closed', viewValue: 'Closed'}
  ];

  constructor(private route: ActivatedRoute,
              private residentService: ResidentService,
              private assetService: AssetService,
              private buildingService: BuildingService,
              private workOrderService: WorkorderService,
              private departmentService: DepartmentService,
              private workerService: WorkerService,
              private router: Router,
              private dialog: MatDialog) {

  }

  ngOnInit() {
    this.workOrderId = +this.route.snapshot.paramMap.get('id');
    this.residents = this.residentService.getResidents();
    this.residents.sort(function (a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    this.assets = this.assetService.getAssets();
    this.buildings = this.buildingService.getBuildings();
    this.departments = this.departmentService.getDepartments();
    this.workers = this.workerService.getWorkers();

    this.workOrder = this.workOrderService.getWorkOrder(this.workOrderId);
    this.workersTimeWorked = (typeof this.workOrder.workersTimeWorked != "undefined")? this.workOrder.workersTimeWorked:this.workersTimeWorked;
    //undefined check otherwise it might produce error.
    this.isBuilding = (typeof this.workOrder.buildingCheck != "undefined") ? this.workOrder.buildingCheck : false;
    this.isResident = (typeof this.workOrder.residentCheck != "undefined") ? this.workOrder.residentCheck : false;
  }

  onSubmit() {
    const dialogRef = this.dialog.open(EditComponent, {
      data: {
        id: this.workOrderId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //set the isBuilding and isResident property
        this.workOrder.residentCheck = this.isResident;
        this.workOrder.buildingCheck = this.isBuilding;
        this.workOrder.workersTimeWorked = this.workersTimeWorked;
        this.updateWorkOrder(this.workOrderId, this.workOrder);
      }
    });

  }
  onAddWorker() {
    if (typeof this.workOrder.workerId === 'undefined'){
      return;
    }
    let foundWorker = this.workersTimeWorked.find(w => w.workerId === this.workOrder.workerId);
    if (typeof foundWorker === 'undefined'){
      let workerName = this.workerService.getWorkerById(this.workOrder.workerId);
      this.timeWorked = {workerId:this.workOrder.workerId,timeWorked:0,workerName:workerName};
      this.workersTimeWorked.push(this.timeWorked);
    }
  }
  onRemoveWorker(workerId) {
    let totalTimeWorked = 0;
    this.workersTimeWorked = this.workersTimeWorked.filter(el => el.workerId!==workerId);
    this.workersTimeWorked.map((workOrder) => {
      totalTimeWorked += (workOrder.timeWorked)*1
    });
    this.workOrder.timeWorked = totalTimeWorked;
  }
  onUpdateWorkerTime(timeWorked,workerId){
    let totalTimeWorked = 0;
    //Find index of specific object using findIndex method.
    let index = this.workersTimeWorked.findIndex((w => w.workerId == workerId));
    this.workersTimeWorked[index].timeWorked = timeWorked;
    this.workersTimeWorked.map((workOrder) => {
      totalTimeWorked += (workOrder.timeWorked)*1
    });
    this.workOrder.timeWorked = totalTimeWorked;
  }
  onPrintWorkOrder() {
    //Print the work order
    this.workOrderService.printWorkOrder = this.workOrder;
    this.router.navigate(['/print-work-order', 'edit-work-order']);
  }

  onFillRoomPhone() {
    if (this.workOrder.residentId !==null && this.workOrder.buildingId !==null){
      //fill the room and phone for the newWrokOrder
      let resident = this.residentService.getRoomPhone(this.workOrder.residentId,this.workOrder.buildingId);
      this.workOrder.room = resident.room;
      this.workOrder.phone = resident.phone;
    }
  }
  onChangeResident() {
    //change phone number and room
    let resident = this.residentService.getBuildingRoomPhone(this.workOrder.residentId);
    this.workOrder.room = resident.room;
    this.workOrder.phone = resident.phone;
    this.workOrder.buildingId = resident.building;
  }

  onChangeRoom() {
    //check building property and room and get the resident
    //set the residentId
    if (this.workOrder.buildingId != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.workOrder.buildingId, this.workOrder.room);
      this.workOrder.residentId = (typeof resident != "undefined") ? resident.Id : this.workOrder.residentId;
      //also set the phone number
      this.workOrder.phone = (typeof resident != "undefined") ? resident.phone : this.workOrder.phone;
    }
  }

  onChangeBuilding() {
    //check building property and room and get the resident
    //set the residentId
    if (this.workOrder.room != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.workOrder.buildingId, this.workOrder.room);
      this.workOrder.residentId = (typeof resident != "undefined") ? resident.Id : null;
      //also set the phone number
      this.workOrder.phone = (typeof resident != "undefined") ? resident.phone : '';
      this.workOrder.room = (typeof resident != "undefined") ? resident.room : null;
    }
  }

  onCompleted() {
    //check the date if not null change the open to close
    if (this.workOrder.dateCompleted != null){
      this.workOrder.status = 'Closed';
    }
    else {
      this.workOrder.status = 'Open';
    }
  }

  updateWorkOrder(workOrderId: number, workOrder: Workorder) {
    this.workOrderService.updateWorkOrder(workOrderId, workOrder).then(
      () => {
        //OnSuccess Redirect to worker table
        this.router.navigateByUrl('work-order');
      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngAfterViewInit(): void {
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style', 'display:flex');
  }

}
