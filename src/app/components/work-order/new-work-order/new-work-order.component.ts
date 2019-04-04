import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {AssetService} from "../../../services/asset.service";
import {ResidentService} from "../../../services/resident.service";
import {WorkorderService} from "../../../services/workorder.service";
import {Asset} from "../../../models/asset";
import {Resident} from "../../../models/resident";
import {Workorder} from "../../../models/workorder";
import {Router} from "@angular/router";
import {BuildingService} from "../../../services/building.service";
import {Building} from "../../../models/building";
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";
import {WorkerService} from "../../../services/worker.service";
import {Worker} from "../../../models/worker";
import {Timeworked} from "../../../models/timeworked";

@Component({
  selector: 'app-new-work-order',
  templateUrl: './new-work-order.component.html',
  styleUrls: ['./new-work-order.component.css']
})
export class NewWorkOrderComponent implements OnInit, AfterViewInit {

  newWorkOrder: Workorder = {
    Id: null, description: '', assetId: null, requestedBy: '',
    dateIssue: new Date(), dateCompleted: null, status: 'Open',
    residentId: null, room: null, phone: '', timeWorked: 0
  };
  isResident: boolean = false;
  isBuilding: boolean = false;
  workersTimeWorked: Timeworked[] = [];
  timeWorked: Timeworked;
  statuss = [
    {value: 'Open', viewValue: 'Open'},
    {value: 'Closed', viewValue: 'Closed'}
  ];
  buildings: Building[];
  assets: Asset[];
  residents: Resident[];
  departments: Department[];
  workers: Worker[];

  constructor(private assetService: AssetService,
              private residentService: ResidentService,
              private workOrderService: WorkorderService,
              private buildingService: BuildingService,
              private departmentService: DepartmentService,
              private workerService: WorkerService,
              private router: Router) {
  }

  ngOnInit() {
    this.findResidents();
  }

  onAddWorker() {
    if (typeof this.newWorkOrder.workerId === 'undefined') {
      return;
    }
    let foundWorker = this.workersTimeWorked.find(w => w.workerId === this.newWorkOrder.workerId);
    if (typeof foundWorker === 'undefined') {
      let workerName = this.workerService.getWorkerById(this.newWorkOrder.workerId);
      this.timeWorked = {workerId: this.newWorkOrder.workerId, timeWorked: 0, workerName: workerName};
      this.workersTimeWorked.push(this.timeWorked);
    }

  }

  onRemoveWorker(workerId) {
    let totalTimeWorked = 0;
    this.workersTimeWorked = this.workersTimeWorked.filter(el => el.workerId !== workerId);
    this.workersTimeWorked.map((workOrder) => {
      totalTimeWorked += (workOrder.timeWorked) * 1
    });
    this.newWorkOrder.timeWorked = totalTimeWorked;
  }

  onUpdateWorkerTime(timeWorked, workerId) {
    let totalTimeWorked = 0;
    //Find index of specific object using findIndex method.
    let index = this.workersTimeWorked.findIndex((w => w.workerId == workerId));
    this.workersTimeWorked[index].timeWorked = timeWorked;
    this.workersTimeWorked.map((workOrder) => {
      totalTimeWorked += (workOrder.timeWorked) * 1
    });
    this.newWorkOrder.timeWorked = totalTimeWorked;
  }

  onFillRoomPhone() {
    if (this.newWorkOrder.residentId !== null && this.newWorkOrder.buildingId !== null) {
      //fill the room and phone for the newWrokOrder
      let resident_room_phone = this.residentService.getRoomPhone(this.newWorkOrder.residentId, this.newWorkOrder.buildingId);
      this.newWorkOrder.room = resident_room_phone.room;
      this.newWorkOrder.phone = resident_room_phone.phone;
    }

  }

  onChangeResident() {
    //get room and phone building;
    let resident = this.residentService.getBuildingRoomPhone(this.newWorkOrder.residentId);
    this.newWorkOrder.room = resident.room;
    this.newWorkOrder.phone = resident.phone;
    this.newWorkOrder.buildingId = resident.building;
  }
  //
  onChangeRoom() {
    //check building property and room and get the resident
    //set the residentId
    if (this.newWorkOrder.buildingId != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.newWorkOrder.buildingId, this.newWorkOrder.room);
      this.newWorkOrder.residentId = (typeof resident != "undefined") ? resident.Id : this.newWorkOrder.residentId;
      //also set the phone number
      this.newWorkOrder.phone = (typeof resident != "undefined") ? resident.phone : this.newWorkOrder.phone;
    }
  }

  onChangeBuilding() {
    //check building property and room and get the resident
    //set the residentId
    if (this.newWorkOrder.room != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.newWorkOrder.buildingId, this.newWorkOrder.room);
      this.newWorkOrder.residentId = (typeof resident != "undefined") ? resident.Id : null;
      //also set the phone number
      this.newWorkOrder.phone = (typeof resident != "undefined") ? resident.phone : '';
      this.newWorkOrder.room = (typeof resident != "undefined") ? resident.room : null;
    }
  }

  onPrintWorkOrder() {
    //print the work order
    //set the workOrder
    this.newWorkOrder.buildingCheck = this.isBuilding;
    this.newWorkOrder.residentCheck = this.isResident;
    this.addWorkOrder(this.newWorkOrder);
    this.workOrderService.printWorkOrder = this.newWorkOrder;
    this.router.navigate(['/print-work-order', 'new-work-order']);
  }

  onSubmit() {
    //validate the data
    //Set buildingCheck and residentCheck
    this.newWorkOrder.buildingCheck = this.isBuilding;
    this.newWorkOrder.residentCheck = this.isResident;
    this.newWorkOrder.workersTimeWorked = this.workersTimeWorked;
    this.addWorkOrder(this.newWorkOrder);
  }

  onCompleted() {
    //check the date if not null change the open to close
    if (this.newWorkOrder.dateCompleted != null) {
      this.newWorkOrder.status = 'Closed';
    }
    else {
      this.newWorkOrder.status = 'Open';
    }
  }

  findWorkOrders() {
    this.workOrderService.findWorkOrders().then(
      (workOrders) => {
        this.workOrderService.workOrders = workOrders;
        //First set the residentName by residentId
        this.newWorkOrder.Id = this.workOrderService.getMaxId();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findResidents() {
    this.residentService.findResidents().then(
      (residents) => {
        this.residentService.residents = residents;
        this.residents = this.residentService.residents;
        this.residents.sort(function (a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.findAssets();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findAssets() {
    this.assetService.findAssets().then(
      (assets) => {
        this.assetService.assets = assets;
        this.assets = this.assetService.assets;
        this.findBuildings();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findBuildings() {
    this.buildingService.findBuildings().then(
      (buildings) => {
        this.buildingService.buildings = buildings;
        this.buildings = this.buildingService.buildings;
        this.findDepartments();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findDepartments() {
    this.departmentService.findDepartments().then(
      (departments) => {
        this.departmentService.departments = departments;
        this.departments = this.departmentService.departments;
        this.findWorkers();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findWorkers() {
    this.workerService.findWorkers().then(
      (workers) => {
        this.workerService.workers = workers;
        this.workers = this.workerService.workers;
        this.findWorkOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  addWorkOrder(workOrder) {
    this.workOrderService.insertWorkOrder(workOrder).then(
      () => {
        // here set the work id in the localStorage
        localStorage.setItem('work_id', workOrder.Id);
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
