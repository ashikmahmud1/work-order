import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Workorder} from "../../models/workorder";
import {WorkorderService} from "../../services/workorder.service";
import {Router} from "@angular/router";
import {ResidentService} from "../../services/resident.service";
import {AssetService} from "../../services/asset.service";
import {BuildingService} from "../../services/building.service";
import {DepartmentService} from "../../services/department.service";
import {WorkerService} from "../../services/worker.service";
import {Building} from "../../models/building";
import {Resident} from "../../models/resident";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";
import {Department} from "../../models/department";
import {ElectronService} from "ngx-electron";

declare var jsPDF: any;

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.css']
})
export class WorkOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['Id', 'departmentName', 'assetName', 'buildingName', 'residentName', 'timeWorked', 'dateIssue', 'dateCompleted', 'status', 'action'];
  dataSource = new MatTableDataSource<Workorder>();
  filterData = {fromDate: null, toDate: null, status: '', residentName: '', buildingName: '', departmentName: ''};
  filterArray = [];
  initialDataArray = [];
  buildings: Building[];
  residents: Resident[];
  departments: Department[];
  workOrderSortSubscription: Subscription;
  statuss = [
    {value: 'Open', viewValue: 'Open'},
    {value: 'Closed', viewValue: 'Closed'}
  ];

  fs;
  appPath;
  dbPath;
  archivePath;

  constructor(private workOrderService: WorkorderService,
              private router: Router,
              private residentService: ResidentService,
              private buildingService: BuildingService,
              private departmentService: DepartmentService,
              private workerService: WorkerService,
              private assetService: AssetService,
              private _electronService: ElectronService) {
    this.fs = this._electronService.remote.require('fs');

    this.appPath = this._electronService.remote.app.getAppPath();
    this.dbPath = this.appPath + '/db/backup.json';
    this.archivePath = this.appPath + '/db/archive.json'

  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.findResidents();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style', 'display:flex');
    this.workOrderSortSubscription = this.sort.sortChange.subscribe(() => {
      this.dataSource.sortData(this.dataSource.filteredData, this.sort);
    });
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterWorkOrders() {
    this.filterArray = this.initialDataArray;
    //check one by one condition and filter.
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
      if (this.filterData.status === 'Open') {
        this.filterArray = this.filterArray.filter(w => w.dateCompleted === null);
      }
      else {
        this.filterArray = this.filterArray.filter(w => w.dateCompleted !== null);
      }
    }

    //filter work order by resident, building and department
    if (this.filterData.buildingName !== '') {
      this.filterArray = this.filterArray.filter(w => w.buildingName == this.filterData.buildingName)
    }
    if (this.filterData.residentName !== '') {
      this.filterArray = this.filterArray.filter(w => w.residentName == this.filterData.residentName)
    }
    if (this.filterData.departmentName !== '') {
      this.filterArray = this.filterArray.filter(w => w.departmentName == this.filterData.departmentName)
    }
    this.dataSource.data = this.filterArray;
  }

  Navigate() {
    this.router.navigateByUrl('new-work-order');
  }

  onEditWorkOrder(workOrderId: number) {
    this.router.navigate(['/edit-work-order', workOrderId]);
  }

  onPrintAll() {
    //show all the items in the table
    if (this.filterData.fromDate === null && this.filterData.toDate === null
      && this.filterData.status === '' && this.filterData.buildingName === ''
      && this.filterData.residentName === '') {
      this.workOrderService.printWorkOrders = this.initialDataArray;
    }
    else {
      this.workOrderService.printWorkOrders = this.filterArray;
    }
    this.printWorkOrders();
  }

  printWorkOrders() {
    //format the Date using the date pipe
    let datePipe = new DatePipe('en-US');
    this.workOrderService.printWorkOrders.forEach(function (workerOrder) {
      workerOrder.dateIssue = datePipe.transform(workerOrder.dateIssue, 'dd/MM/yyyy');
      workerOrder.dateCompleted = datePipe.transform(workerOrder.dateCompleted, 'dd/MM/yyyy');
    });
    let columns = [
      {title: "ID", dataKey: "Id"},
      {title: "Department", dataKey: "departmentName"},
      {title: "Building", dataKey: "buildingName"},
      {title: "Resident", dataKey: "residentName"},
      {title: "Worked", dataKey: "timeWorked"},
      {title: "Issue", dataKey: "dateIssue"},
      {title: "Completed", dataKey: "dateCompleted"},
      {title: "Status", dataKey: "status"},
    ];
    let rows = this.workOrderService.printWorkOrders;
    let doc = new jsPDF('p', 'pt');

    doc.setFontSize(20);
    doc.text(30, 30, 'Table');

    doc.autoTable(columns, rows, {
      margin: {top: 50, left: 20, right: 20, bottom: 0},
      drawHeaderCell: function (cell, data) {
        cell.styles.textColor = 255;
        cell.styles.fontSize = 9;
      },
      createdCell: function (cell, data) {
        cell.styles.fontSize = 6;
        cell.styles.textColor = [0, 0, 0];
      }
    });
    doc.save('workorders.pdf');
  }

  onReportWorkOrder(workOrderId: number) {
    this.router.navigate(['/work-report', workOrderId]);
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
        this.initialDataArray = this.dataSource.data;
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
        this.findWorkOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngOnDestroy() {
    this.workOrderSortSubscription.unsubscribe();
  }
}
