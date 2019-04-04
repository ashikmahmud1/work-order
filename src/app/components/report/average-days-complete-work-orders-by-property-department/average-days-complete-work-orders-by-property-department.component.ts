import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {WorkorderService} from "../../../services/workorder.service";
import {Workorder} from "../../../models/workorder";
import {BuildingService} from "../../../services/building.service";
import {DepartmentService} from "../../../services/department.service";
import {Building} from "../../../models/building";

declare var jsPDF: any;

@Component({
  selector: 'app-average-days-complete-work-orders-by-property-department',
  templateUrl: './average-days-complete-work-orders-by-property-department.component.html',
  styleUrls: ['./average-days-complete-work-orders-by-property-department.component.css']
})
export class AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date-range', 'building', 'department'];
  dataSource = new MatTableDataSource<any>();
  workOrders: Workorder[];
  buildings: Building[];
  fromDate: Date;
  toDate: Date;
  buildingDepartmentWorkedTime = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private workOrderService: WorkorderService,
              private buildingService: BuildingService,
              private departmentService: DepartmentService) {
  }

  ngOnInit() {
    let dateOneMonthAgo = new Date();
    dateOneMonthAgo.setMonth(dateOneMonthAgo.getMonth() - 1);
    this.fromDate = dateOneMonthAgo;
    this.toDate = new Date();
    this.findBuildings();
  }

  onChangeDate() {
    this.buildingDepartmentWorkedTime = [];
    this.buildings.map((building) => {
      let departmentWorkTime = [];
      let totalHours = 0;
      let departmentHours = '';
      this.workOrders.map((workOrder) => {
        //check the date range
        //first check workorder is completed or not
        if (workOrder.dateIssue != null && workOrder.dateCompleted != null) {
          //check the workorder building
          if (workOrder.buildingId == building.Id) {
            if (workOrder.dateIssue >= this.fromDate && workOrder.dateCompleted <= this.toDate) {
              totalHours += workOrder.timeWorked;
            }
          }
        }
      });
      // foreach department filter workorder by department id
      this.departmentService.departments.map((department) => {
        // first filter work order by building
        let buildingFilteredWorkOrder = this.workOrderService.workOrders.filter(w => w.buildingId === building.Id && w.dateIssue >= this.fromDate && w.dateCompleted <= this.toDate);
        // from that filtered building work order. filter work order by department
        let departmentFilteredWorkOrder = buildingFilteredWorkOrder.filter(w => w.departmentId === department.Id);
        let totalHoursWorked = 0;
        // calculate total hours worked by that department
        departmentFilteredWorkOrder.map((workOrder) => {
          totalHoursWorked +=workOrder.timeWorked;
        });
        departmentHours += this.departmentService.getDeptById(department.Id)+' - '+totalHoursWorked+' , ';
        // finally push that department and hours to the departmentWorkTime array
        departmentWorkTime.push({departmentName:department.name,worked_hours:totalHoursWorked})
      });
      //insert into the final buildingDepartment Array
      let finalObject = {
        buildingName: building.name,
        totalHours: totalHours,
        departmentInfo: departmentWorkTime,
        departmentHours: departmentHours,
        buildingHours: building.name + ' - ' + totalHours,
        dateRange: this.format_date(this.fromDate) + ' - ' + this.format_date(this.toDate)
      };
      this.buildingDepartmentWorkedTime.push(finalObject);
    });
    this.dataSource.data = this.buildingDepartmentWorkedTime;
  }

  format_date(date: Date) {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  onPrintReport() {
    let columns = [
      {title: "Date Range", dataKey: "dateRange"},
      {title: "Building", dataKey: "buildingHours"},
      {
        title: "Department",
        dataKey: "departmentHours"
      }
    ];
    let rows = this.buildingDepartmentWorkedTime;
    let doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows, {
      styles: {overflow: 'linebreak'},
      columnStyles: {
        departmentHours: {columnWidth: 250},
      },
      margin: {top: 60},
      addPageContent: function (data) {
        doc.text("Completed Work Orders By Building Department", 40, 30);
      }
    });
    doc.save('completed-work-orders-by-building-department.pdf');
  }

  findWorkOrders() {
    this.workOrderService.findWorkOrders().then(
      (workOrders) => {
        this.workOrderService.workOrders = workOrders;
        this.workOrders = this.workOrderService.workOrders;
        this.onChangeDate();
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
        this.findWorkOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
