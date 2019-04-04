import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {BuildingService} from "../../../services/building.service";
import {WorkorderService} from "../../../services/workorder.service";
import {Workorder} from "../../../models/workorder";
import {Building} from "../../../models/building";
import {Router} from "@angular/router";
declare var jsPDF: any;

@Component({
  selector: 'app-average-days-complete-work-orders-by-property',
  templateUrl: './average-days-complete-work-orders-by-property.component.html',
  styleUrls: ['./average-days-complete-work-orders-by-property.component.css']
})
export class AverageDaysCompleteWorkOrdersByPropertyComponent implements OnInit, AfterViewInit {
  displayedColumns = ['building', 'date-range', 'completed-orders', 'avg-time'];
  dataSource = new MatTableDataSource<any>();

  workOrders: Workorder[];
  buildings: Building[];
  completedOrdersByBuildings = [];
  minDateIssue: Date;
  maxDateCompleted: Date;

  constructor(private buildingService: BuildingService,
              private workOrderService: WorkorderService,
              private router:Router) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.findBuildings();
  }

  onChangeCompleteWorkOrdersByBuilding() {
    if (this.workOrders.length > 0) {
      //foreach building find the workorder
      this.completedOrdersByBuildings = [];

      for (let i = 0; i < this.buildings.length; i++) {
        let totalCompletedWorkOrders = 0;
        let totalDays = 0;
        for (let j = 0; j < this.workOrders.length; j++) {

          //first check workorder is completed or not
          if (this.workOrders[j].dateIssue != null && this.workOrders[j].dateCompleted != null) {
            //check the workorder building
            if (this.workOrders[j].buildingId == this.buildings[i].Id) {

              if (this.workOrders[j].dateIssue >= this.minDateIssue && this.workOrders[j].dateCompleted <= this.maxDateCompleted) {
                //get the time difference between date-issue and date-completed
                let timeDiff = Math.abs(this.workOrders[j].dateIssue.getTime() - this.workOrders[j].dateCompleted.getTime());
                // add the subtracted value with total
                totalDays += Math.ceil(timeDiff / (1000 * 3600 * 24));
                totalCompletedWorkOrders++;
              }

            }
          }

        }

        let dateRange = this.format_date(this.minDateIssue) + ' - ' + this.format_date(this.maxDateCompleted);
        let avgTime = totalDays / totalCompletedWorkOrders;
        let buildingName = this.buildingService.getBuildingById(this.buildings[i].Id);
        this.completedOrdersByBuildings.push({
          building: buildingName,
          dateRange: dateRange,
          completedOrders: totalCompletedWorkOrders,
          avg_time: avgTime
        });
      }
      this.dataSource.data = this.completedOrdersByBuildings;
    }
  }

  onCompleteWorkOrdersByBuilding() {
    if (this.workOrders.length > 0) {
      //foreach building find the workorder
      this.minDateIssue = new Date();
      this.maxDateCompleted = new Date(2000, 0o1, 0o1);

      for (let i = 0; i < this.buildings.length; i++) {
        let totalCompletedWorkOrders = 0;
        let totalDays = 0;
        for (let j = 0; j < this.workOrders.length; j++) {

          //get the minimum date and maximum date
          let minDate = this.workOrders[j].dateIssue;
          let maxDate = this.workOrders[j].dateCompleted;

          this.minDateIssue = (minDate < this.minDateIssue) ? minDate : this.minDateIssue;
          this.maxDateCompleted = (maxDate > this.maxDateCompleted) ? maxDate : this.maxDateCompleted;

          //first check workorder is completed or not
          if (this.workOrders[j].dateIssue != null && this.workOrders[j].dateCompleted != null) {
            //check the workorder building
            if (this.workOrders[j].buildingId == this.buildings[i].Id) {
              //get the time difference between date-issue and date-completed
              let timeDiff = Math.abs(this.workOrders[j].dateIssue.getTime() - this.workOrders[j].dateCompleted.getTime());
              // add the subtracted value with total
              totalDays += Math.ceil(timeDiff / (1000 * 3600 * 24));
              totalCompletedWorkOrders++;
            }
          }

        }

        let dateRange = this.format_date(this.minDateIssue) + ' - ' + this.format_date(this.maxDateCompleted);
        let avgTime = totalDays / totalCompletedWorkOrders;
        let buildingName = this.buildingService.getBuildingById(this.buildings[i].Id);
        this.completedOrdersByBuildings.push({
          building: buildingName,
          dateRange: dateRange,
          completedOrders: totalCompletedWorkOrders,
          avg_time: avgTime
        });
      }
      this.dataSource.data = this.completedOrdersByBuildings;
    }

  }

  onPrintReport() {
    this.workOrderService.printReport = this.completedOrdersByBuildings;
    this.print();
  }
  print() {
    let columns = [
      {title: "Building", dataKey: "building"},
      {title: "Date Range", dataKey: "dateRange"},
      {title: "Orders Completed", dataKey: "completedOrders"},
      {title: "Avg Days Between Issued-Completed", dataKey: "avg_time"},
    ];
    let rows = this.workOrderService.printReport;
    let doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows, {
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text("Average number of Days to Complete Work Orders by Property", 40, 30);
      }
    });
    doc.save('orders-completed-by-property.pdf');
  }
  format_date(date: Date) {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  findBuildings() {
    this.buildingService.findBuildings().then(
      (buildings) => {
        this.buildingService.buildings = buildings;
        this.buildings = this.buildingService.buildings;
        this.findWorkOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findWorkOrders() {
    this.workOrderService.findWorkOrders().then(
      (workOrders) => {
        this.workOrderService.workOrders = workOrders;
        this.workOrders = this.workOrderService.workOrders;
        this.onCompleteWorkOrdersByBuilding()

      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style', 'display:flex');
  }

}
