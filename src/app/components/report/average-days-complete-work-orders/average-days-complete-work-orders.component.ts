import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WorkorderService} from "../../../services/workorder.service";
import {Workorder} from "../../../models/workorder";
import {MatTableDataSource} from "@angular/material";
import {Router} from "@angular/router";
declare var jsPDF: any;

@Component({
  selector: 'app-average-days-complete-work-orders',
  templateUrl: './average-days-complete-work-orders.component.html',
  styleUrls: ['./average-days-complete-work-orders.component.css']
})
export class AverageDaysCompleteWorkOrdersComponent implements OnInit,AfterViewInit {

  displayedColumns = ['date-range', 'completed-orders', 'avg-time'];
  dataSource = new MatTableDataSource<any>();

  workOrders: Workorder[];
  minDateIssue: Date;
  maxDateCompleted: Date;
  completedOrders = [];

  constructor(private workOrderService: WorkorderService,private router:Router) {
  }

  ngOnInit() {
    this.findWorkOrders();
  }

  onChangeCompleteWorkOrders() {
    this.completedOrders = [];
    if (this.workOrders.length > 0) {
      let totalCompletedWorkOrders = 0;
      let totalDays = 0;
      for (let i = 0; i < this.workOrders.length; i++) {

        //first check if date-issue and date-completed null or not

        if (this.workOrders[i].dateIssue != null && this.workOrders[i].dateCompleted != null) {
          //check if the date issue and date completed inside the range
          if (this.workOrders[i].dateIssue >= this.minDateIssue && this.workOrders[i].dateCompleted <= this.maxDateCompleted) {
            //if inside range then subtract date-issue and date-completed
            let timeDiff = Math.abs(this.workOrders[i].dateIssue.getTime() - this.workOrders[i].dateCompleted.getTime());
            // add the subtracted value with total
            totalDays += Math.ceil(timeDiff / (1000 * 3600 * 24));

            totalCompletedWorkOrders++;
          }
        }
      }
      if (totalCompletedWorkOrders != 0) {
        let dateRange = this.format_date(this.minDateIssue) + ' - ' + this.format_date(this.maxDateCompleted);
        let avgTime = totalDays / totalCompletedWorkOrders;

        this.completedOrders.push({dateRange: dateRange, completedOrders: totalCompletedWorkOrders, avg_time: avgTime})
        this.dataSource.data = this.completedOrders;
      }
    }
  }

  onCompleteWorkOrders() {

    if (this.workOrders.length > 0) {
      this.minDateIssue = new Date();
      this.maxDateCompleted = new Date(2000, 0o1, 0o1);

      let totalCompletedWorkOrders = 0;
      let totalDays = 0;
      for (let i = 0; i < this.workOrders.length; i++) {

        //first check if date-issue and date-completed null or not

        if (this.workOrders[i].dateIssue != null && this.workOrders[i].dateCompleted != null) {
          let minDate = this.workOrders[i].dateIssue;
          let maxDate = this.workOrders[i].dateCompleted;

          this.minDateIssue = (minDate < this.minDateIssue) ? minDate : this.minDateIssue;
          this.maxDateCompleted = (maxDate > this.maxDateCompleted) ? maxDate : this.maxDateCompleted;

          let timeDiff = Math.abs(this.workOrders[i].dateIssue.getTime() - this.workOrders[i].dateCompleted.getTime());
          // add the subtracted value with total
          totalDays += Math.ceil(timeDiff / (1000 * 3600 * 24));
          totalCompletedWorkOrders++;
        }
      }
      if (totalCompletedWorkOrders != 0) {

        let dateRange = this.format_date(this.minDateIssue) + ' - ' + this.format_date(this.maxDateCompleted);
        let avgTime = totalDays / totalCompletedWorkOrders;

        this.completedOrders.push({dateRange: dateRange, completedOrders: totalCompletedWorkOrders, avg_time: avgTime});
        this.dataSource.data = this.completedOrders;
      }
    }

  }

  onPrintReport() {
    this.workOrderService.printReport = this.completedOrders;
    this.print();
  }
  print() {
    let columns = [
      {title: "Date Range", dataKey: "dateRange"},
      {title: "Orders Completed", dataKey: "completedOrders"},
      {title:"Avg Days Between Issued-Completed",dataKey:"avg_time"}
    ];
    let rows = this.workOrderService.printReport;
    let doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows, {
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text("Average Number of Days to Complete All Work Orders", 40, 30);
      }
    });
    doc.save('avg-days-complete-work-orders.pdf');
  }

  format_date(date: Date) {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  findWorkOrders() {
    this.workOrderService.findWorkOrders().then(
      (workOrders) => {
        this.workOrderService.workOrders = workOrders;
        this.workOrders = this.workOrderService.workOrders;
        this.onCompleteWorkOrders();

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
