import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Department} from "../../models/department";
import {DepartmentService} from "../../services/department.service";
import {DeleteComponent} from "../delete/delete.component";
import {WorkerService} from "../../services/worker.service";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit,AfterViewInit {
  displayedColumns = ['Id','name','subcontractor','action'];
  dataSource = new MatTableDataSource<Department>();
  constructor(private router:Router,
              private departmentService:DepartmentService,
              private workerService:WorkerService,
              private dialog:MatDialog) { }
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  ngOnInit() {
    //We might not get the data from the assets table since it's calling asynchronously.
    //So we should do all the initialization task inside findDepartments function.
    this.findDepartments();
  }
  Navigate()
  {
    this.router.navigateByUrl('new-department');
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onEditDepartment(departmentId:number)
  {
    this.router.navigate(['/edit-department',departmentId]);
  }
  onDeleteDepartment(departmentId:number)
  {
    const dialogRef = this.dialog.open(DeleteComponent,{
      data:{
        id:departmentId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.removeDepartment(departmentId);
      }
    });

    console.log(departmentId)
  }
  findDepartments () {
    this.departmentService.findDepartments().then(
      (departments) => {
        this.departmentService.departments = departments;
        this.dataSource.data = this.departmentService.getDepartments();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  removeDepartment (departmentId) {
    this.departmentService.removeDepartment(departmentId).then(
      () => {
        this.removeWorker(departmentId);
        //delete all the workers associated with this department
      },
      (err) => {
        console.log(err);
      }
    )
  }
  removeWorker (DeptId) {
    this.workerService.removeWorkerByDept(DeptId).then(
      () => {
        this.findWorkers();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  findWorkers () {
    this.workerService.findWorkers().then(
      (workers) => {
        this.workerService.workers = workers;
        this.findDepartments();
        console.log('find workers called');
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
