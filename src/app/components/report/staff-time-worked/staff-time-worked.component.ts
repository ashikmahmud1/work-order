import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {WorkorderService} from "../../../services/workorder.service";
import {WorkerService} from "../../../services/worker.service";
import {Worker} from "../../../models/worker";
import {Workorder} from "../../../models/workorder";
import {Router} from "@angular/router";
declare var jsPDF: any;

@Component({
  selector: 'app-staff-time-worked',
  templateUrl: './staff-time-worked.component.html',
  styleUrls: ['./staff-time-worked.component.css']
})
export class StaffTimeWorkedComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'worked-hours'];
  dataSource = new MatTableDataSource<any>();
  //workTime
  minDateIssue: Date;
  maxDateCompleted: Date;
  workTime = [];
  workers: Worker[];
  workOrders: Workorder[];

  constructor(private workOrderService: WorkorderService,
              private workerService: WorkerService,
              private router:Router) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //get all the worker
  // loop through all the worker and check the workorder completed by the worker
  //if workorder completed by worker same then add it in a sum variable
  ngOnInit() {
    //get all the data
    this.findWorkers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style', 'display:flex');
  }

  onChangeTimeWorked() {
    if (this.workers.length > 0) {
      this.workTime = [];
      for (let i = 0; i < this.workers.length; i++) {
        let sum = 0;
        for (let j = 0; j < this.workOrders.length; j++) {

          //check the worker table id with the workOrders table id
          if (this.workers[i].Id == this.workOrders[j].workerId) {
            if (this.workOrders[j].dateIssue >= this.minDateIssue && this.workOrders[j].dateCompleted <= this.maxDateCompleted) {
              sum += this.workOrders[j].timeWorked;
            }
          }
        }
        let timeWorked = {name: this.workers[i].name, worked_hours: sum};
        this.workTime.push(timeWorked);
      }
      this.dataSource.data = this.workTime;
    }
  }

  onTimeWorked() {
    if (this.workers.length > 0) {
      this.minDateIssue = new Date();
      this.maxDateCompleted = new Date(2000, 0o1, 0o1);
      for (let i = 0; i < this.workers.length; i++) {
        let sum = 0;
        for (let j = 0; j < this.workOrders.length; j++) {

          let minDate = this.workOrders[j].dateIssue;
          let maxDate = this.workOrders[j].dateCompleted;

          this.minDateIssue = (minDate < this.minDateIssue) ? minDate : this.minDateIssue;
          this.maxDateCompleted = (maxDate > this.maxDateCompleted) ? maxDate : this.maxDateCompleted;

          //check the worker table id with the workOrders table id

          // if no worker assigned then workersTimeWorked array will be undefined
          //so we need to type check before mapping that array

          if (typeof this.workOrders[j].workersTimeWorked !=='undefined'){
            this.workOrders[j].workersTimeWorked.map((wTimeWorked) =>{
              if (this.workers[i].Id == wTimeWorked.workerId) {
                sum += (wTimeWorked.timeWorked * 1);
              }
            });
          }
        }
        let timeWorked = {name: this.workers[i].name, worked_hours: sum};
        this.workTime.push(timeWorked);
      }
      this.dataSource.data = this.workTime;
    }
  }

  onPrintReport(){
    this.workOrderService.printReport = this.workTime;
    this.print();
  }
  print() {
    let columns = [
      {title: "Name", dataKey: "name"},
      {title: "Total Time Worked (hr)", dataKey: "worked_hours"},
    ];
    let rows = this.workOrderService.printReport;
    let doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows, {
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text("Staff Time Worked", 40, 30);
      }
    });
    doc.save('staff-time-worked.pdf');
  }

  findWorkOrders() {
    this.workOrderService.findWorkOrders().then(
      (workOrders) => {
        this.workOrderService.workOrders = workOrders;
        this.workOrders = this.workOrderService.workOrders;
        this.onTimeWorked();

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

}
