import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Timeworked} from "../../../models/timeworked";
import {WorkerService} from "../../../services/worker.service";
import {Router} from "@angular/router";
import {Projectorder} from "../../../models/projectorder";
import {ProjectorderService} from "../../../services/projectorder.service";
import {Asset} from "../../../models/asset";
import {Resident} from "../../../models/resident";
import {AssetService} from "../../../services/asset.service";
import {ResidentService} from "../../../services/resident.service";
import {BuildingService} from "../../../services/building.service";
import {Building} from "../../../models/building";
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";

@Component({
  selector: 'app-new-project-order',
  templateUrl: './new-project-order.component.html',
  styleUrls: ['./new-project-order.component.css']
})
export class NewProjectOrderComponent implements OnInit, AfterViewInit {

  isBuilding: boolean = false;
  isResident: boolean = false;
  newProjectOrder: Projectorder = {
    Id: null, description: '', assetId: null, requestedBy: ''
    , amount: 0, dateIssue: new Date(), dateCompleted: null,
    residentId: null, room: null, phone: '', dateTimeWorked: null
  };
  displayedColumns = ['worker', 'date', 'time-worked'];
  dateWorked: Timeworked[] = [];
  dataSource = new MatTableDataSource<Timeworked>();
  assets: Asset[];
  buildings: Building[];
  residents: Resident[];
  departments: Department[];

  constructor(private projectOrderService: ProjectorderService,
              private workerService: WorkerService,
              private router: Router,
              private assetService: AssetService,
              private residentService: ResidentService,
              private buildingService: BuildingService,
              private departmentService: DepartmentService) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.findResidents();

  }

  onFillRoomPhone() {
    if (this.newProjectOrder.residentId !== null && this.newProjectOrder.buildingId !== null) {
      //fill the room and phone for the newWrokOrder
      let resident = this.residentService.getRoomPhone(this.newProjectOrder.residentId, this.newProjectOrder.buildingId);
      this.newProjectOrder.room = resident.room;
      this.newProjectOrder.phone = resident.phone;
    }
  }
  onChangeResident() {
    //get room and phone building;
    let resident = this.residentService.getBuildingRoomPhone(this.newProjectOrder.residentId);
    this.newProjectOrder.room = resident.room;
    this.newProjectOrder.phone = resident.phone;
    this.newProjectOrder.buildingId = resident.building;
  }
  //
  onChangeRoom() {
    //check building property and room and get the resident
    //set the residentId
    if (this.newProjectOrder.buildingId != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.newProjectOrder.buildingId, this.newProjectOrder.room);
      this.newProjectOrder.residentId = (typeof resident != "undefined") ? resident.Id : this.newProjectOrder.residentId;
      //also set the phone number
      this.newProjectOrder.phone = (typeof resident != "undefined") ? resident.phone : this.newProjectOrder.phone;
    }
  }

  onChangeBuilding() {
    //check building property and room and get the resident
    //set the residentId
    if (this.newProjectOrder.room != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.newProjectOrder.buildingId, this.newProjectOrder.room);
      this.newProjectOrder.residentId = (typeof resident != "undefined") ? resident.Id : null;
      //also set the phone number
      this.newProjectOrder.phone = (typeof resident != "undefined") ? resident.phone : '';
      this.newProjectOrder.room = (typeof resident != "undefined") ? resident.room : null;
    }
  }
  onSubmit() {
    //set the timeworked table newProjectOrder.dateTimeWorked
    this.newProjectOrder.dateTimeWorked = this.dateWorked;
    //Set residentCheck and buildingCheck field
    this.newProjectOrder.buildingCheck = this.isBuilding;
    this.newProjectOrder.residentCheck = this.isResident;
    this.addProjectOrder(this.newProjectOrder);

  }

  onPrintProjectOrder() {
    //set the project order and print
    //set the timeworked table newProjectOrder.dateTimeWorked
    this.newProjectOrder.dateTimeWorked = this.dateWorked;
    //Set residentCheck and buildingCheck field
    this.newProjectOrder.buildingCheck = this.isBuilding;
    this.newProjectOrder.residentCheck = this.isResident;
    this.addProjectOrder(this.newProjectOrder);
    this.projectOrderService.printProjectOrder = this.newProjectOrder;
    this.router.navigate(['/print-project-order', 'new-project-order']);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style', 'display:flex');
  }

  findProjectOrders() {
    this.projectOrderService.findProjectOrders().then(
      (projectOrders) => {
        this.projectOrderService.projectOrders = projectOrders;
        //First set the residentName by residentId
        this.newProjectOrder.Id = this.projectOrderService.getMaxId();

        //get all the worker from the worker table
        //foreach worker push a new object in the timeWorked array
        let self = this;

        this.workerService.workers.forEach(function (worker) {
          let newTimeWorked: Timeworked = {workerId: 0, workerName: '', dateWorked: new Date(), timeWorked: 0};

          newTimeWorked.workerId = worker.Id;
          newTimeWorked.workerName = worker.name;

          self.dateWorked.push(newTimeWorked);
        });
        this.dataSource.data = this.dateWorked;
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
        this.findProjectOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  addProjectOrder(projectOrder) {
    this.projectOrderService.insertProjectOrder(projectOrder).then(
      () => {
        // here set the project id in the localStorage
        localStorage.setItem('project_id', projectOrder.Id);
        this.router.navigateByUrl('');
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
