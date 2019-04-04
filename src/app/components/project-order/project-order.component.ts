import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Projectorder} from "../../models/projectorder";
import {Router} from "@angular/router";
import {ProjectorderService} from "../../services/projectorder.service";
import {ResidentService} from "../../services/resident.service";
import {AssetService} from "../../services/asset.service";
import {WorkerService} from "../../services/worker.service";
import {DepartmentService} from "../../services/department.service";
import {BuildingService} from "../../services/building.service";
import {Building} from "../../models/building";
import {Resident} from "../../models/resident";
import {Asset} from "../../models/asset";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";

declare var jsPDF: any;


@Component({
  selector: 'app-project-order',
  templateUrl: './project-order.component.html',
  styleUrls: ['./project-order.component.css']
})
export class ProjectOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['Id', 'departmentName', 'assetName', 'buildingName', 'residentName', 'requestedBy', 'amount', 'dateIssue', 'dateCompleted', 'action'];
  dataSource = new MatTableDataSource<Projectorder>();
  filterData = {fromDate: null, toDate: null, assetName: '', residentName: '', buildingName: ''};
  buildings: Building[];
  residents: Resident[];
  filterArray = [];
  initialDataArray = [];
  assets: Asset[];
  projectOrderSortSubscription: Subscription;

  constructor(private router: Router,
              private projectOrderService: ProjectorderService,
              private residentService: ResidentService,
              private assetService: AssetService,
              private workerService: WorkerService,
              private departmentService: DepartmentService,
              private buildingService: BuildingService) {
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
    this.projectOrderSortSubscription = this.sort.sortChange.subscribe(() => {
      this.dataSource.sortData(this.dataSource.filteredData, this.sort);
    });
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterProjectOrders() {
    this.filterArray = this.initialDataArray;
    //check one by one condition and filter.
    //if both from date and to date is set then check
    if (this.filterData.fromDate !== null) {
      //filter the data by from date
      this.filterArray = this.filterArray.filter(p => p.dateIssue >= this.filterData.fromDate);
    }
    if (this.filterData.toDate !== null) {
      //filter the data by to date
      this.filterArray = this.filterArray.filter(p => p.dateCompleted <= this.filterData.toDate);
    }

    //filter work order by resident asset and building
    if (this.filterData.buildingName !== '') {
      this.filterArray = this.filterArray.filter(p => p.buildingName == this.filterData.buildingName)
    }
    if (this.filterData.residentName !== '') {
      this.filterArray = this.filterArray.filter(p => p.residentName == this.filterData.residentName)
    }
    if (this.filterData.assetName !== ''){
      this.filterArray = this.filterArray.filter(p => p.assetName == this.filterData.assetName)
    }
    this.dataSource.data = this.filterArray;
  }

  Navigate() {
    this.router.navigateByUrl('new-project-order');
  }

  onEditProjectOrder(projectOrderId: number) {
    this.router.navigate(['/edit-project-order', projectOrderId]);
  }

  onPrintAll() {
    this.projectOrderService.printProjectOrders = this.filterArray.length === 0 ? this.initialDataArray : this.filterArray;
    this.printProjectOrders();
  }

  printProjectOrders() {
    //format the Date using the date pipe
    let datePipe = new DatePipe('en-US');
    this.projectOrderService.printProjectOrders.forEach(function (projectOrder) {
      projectOrder.dateIssue = datePipe.transform(projectOrder.dateIssue, 'dd/MM/yyyy');
      projectOrder.dateCompleted = datePipe.transform(projectOrder.dateCompleted, 'dd/MM/yyyy');
    });
    let columns = [
      {title: "ID", dataKey: "Id"},
      {title: "Department", dataKey: "departmentName"},
      {title: "Building", dataKey: "buildingName"},
      {title: "Resident", dataKey: "residentName"},
      {title: "Requested", dataKey: "requestedBy"},
      {title: "Amount", dataKey: "amount"},
      {title: "Issue", dataKey: "dateIssue"},
      {title: "Completed", dataKey: "dateCompleted"},
    ];
    let rows = this.projectOrderService.printProjectOrders;
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
    doc.save('projectorders.pdf');
  }

  onReportProjectOrder(projectOrderId: number) {
    this.router.navigate(['/project-report', projectOrderId]);
  }

  findProjectOrders() {
    this.projectOrderService.findProjectOrders().then(
      (projectOrders) => {
        this.projectOrderService.projectOrders = projectOrders;
        //First set the residentName by residentId
        var self = this;
        this.projectOrderService.projectOrders.forEach(function (projectOrder) {
          projectOrder.residentName = self.residentService.getResidentById(projectOrder.residentId);
          projectOrder.assetName = self.assetService.getAssetById(projectOrder.assetId);
          projectOrder.departmentName = self.departmentService.getDeptById(projectOrder.departmentId);
          projectOrder.buildingName = self.buildingService.getBuildingById(projectOrder.buildingId);
        });
        //set the assetName by assetId
        this.dataSource.data = this.projectOrderService.getProjectOrders();
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
        this.findProjectOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngOnDestroy() {
    this.projectOrderSortSubscription.unsubscribe();
  }

}
