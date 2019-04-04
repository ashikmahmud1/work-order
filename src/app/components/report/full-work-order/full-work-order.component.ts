import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {WorkorderService} from "../../../services/workorder.service";
import {Router} from "@angular/router";
import {ResidentService} from "../../../services/resident.service";
import {BuildingService} from "../../../services/building.service";
import {DepartmentService} from "../../../services/department.service";
import {WorkerService} from "../../../services/worker.service";
import {AssetService} from "../../../services/asset.service";
import {Building} from "../../../models/building";
import {Resident} from "../../../models/resident";

@Component({
  selector: 'app-full-work-order',
  templateUrl: './full-work-order.component.html',
  styleUrls: ['./full-work-order.component.css']
})
export class FullWorkOrderComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  buildings: Building[];
  residents: Resident[];
  filterArray = [];
  rooms = [];
  filterData = {fromDate: null, toDate: null, status: '', buildingId: null, room: null};
  statuss = [
    {value: '', viewValue: ''},
    {value: 'Open', viewValue: 'Open'},
    {value: 'Closed', viewValue: 'Closed'}
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageArray = [];

  download() {
    this.workOrderService.printWorkOrders = this.filterArray;
    this.router.navigateByUrl('full-work-order-print');

  }

  constructor(private workOrderService: WorkorderService,
              private router: Router,
              private residentService: ResidentService,
              private buildingService: BuildingService,
              private departmentService: DepartmentService,
              private workerService: WorkerService,
              private assetService: AssetService) {
  }

  ngOnInit() {
    this.findResidents();
  }

  onFilterWorkOrders() {
    this.filterArray = this.dataSource.data;
    this.pageArray = [];

    //if both from date and to date is set then check
    if (this.filterData.fromDate !== null) {
      //filter the data by from date
      this.filterArray = this.filterArray.filter(w => w.dateIssue >= this.filterData.fromDate);
    }
    if (this.filterData.toDate !== null) {
      //filter the data by to date
      this.filterArray = this.filterArray.filter(w => w.dateCompleted <= this.filterData.toDate);
    }
    if (this.filterData.status !== '') {
      //filter the data by status
      if (this.filterData.status === 'Open')
      {
        this.filterArray = this.filterArray.filter(w => w.dateCompleted === null);
      }
      else {
        this.filterArray = this.filterArray.filter(w => w.dateCompleted !== null);
      }
    }

    //filter work order by resident room number and building
    if (this.filterData.buildingId !== null) {
      this.filterArray = this.filterArray.filter(w => w.buildingId == this.filterData.buildingId)
    }
    if (this.filterData.room !== null) {
      this.filterArray = this.filterArray.filter(w => w.room == this.filterData.room)
    }
    //pageArray add the first 5 item
    this.paginator.length = this.filterArray.length;
    this.filterArray.map((workOrder, index) => {
      if (index < 5) {
        this.pageArray.push(workOrder);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onChangePage(event) {
    this.pageArray = [];
    //calculate the start index
    //calculate the end index
    let startIndex;
    let endIndex;
    if (event.pageIndex === 0) {
      startIndex = 0;
      endIndex = event.pageSize - 1;
    }
    else {
      startIndex = event.pageIndex * event.pageSize;
      endIndex = (startIndex + event.pageSize) - 1;
    }

    // loop through all data and check if inside the range
    // if it's inside the range then add it to the pageArray.
    this.filterArray.map((workOrder, index) => {
      if (index >= startIndex && index <= endIndex) {
        this.pageArray.push(workOrder);
      }
    });
  }

  findWorkOrders() {
    this.workOrderService.findWorkOrders().then(
      (workOrders) => {
        this.workOrderService.workOrders = workOrders;
        //First set the residentName by residentId
        let self = this;
        this.workOrderService.workOrders.forEach(function (workerOrder) {
          //Set the resident name
          workerOrder.residentName = self.residentService.getResidentById(workerOrder.residentId);
          //Set Asset Name
          workerOrder.assetName = self.assetService.getAssetById(workerOrder.assetId);

          //Set Department Name
          workerOrder.departmentName = self.departmentService.getDeptById(workerOrder.departmentId);

          //Set Worker Name Who is completed the work-order
          workerOrder.workerName = self.workerService.getWorkerById(workerOrder.workerId);

          //Set Building Name.
          workerOrder.buildingName = self.buildingService.getBuildingById(workerOrder.buildingId);
        });

        this.dataSource.data = this.workOrderService.getWorkOrders();
        this.filterArray = this.dataSource.data;
        //pageArray add the first 5 item
        this.filterArray.map((workOrder, index) => {
          if (index < 5) {
            this.pageArray.push(workOrder);
          }
        });
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
        //foreach resident get the room number and push it into the room array
        this.residents.map((resident) => {
          //check if the resident.room is null or not.
          if (resident.room !== null) {
            //if not null then check the room array that this room is already exist in the room array or not.
            let found = this.rooms.find(r => r == resident.room);
            if (!found) {
              this.rooms.push(resident.room);
            }
          }
        });
        this.rooms.sort(function (a, b) {
          if (a < b) return -1;
          if (a > b) return 1;
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
        this.findWorkOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
