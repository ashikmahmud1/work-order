import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Worker} from "../../models/worker";
import {WorkerService} from "../../services/worker.service";
import {Router} from "@angular/router";
import {DepartmentService} from "../../services/department.service";
import {DeleteComponent} from "../delete/delete.component";
import {Subscription} from "rxjs";
declare var jsPDF: any;

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent implements OnInit,AfterViewInit,OnDestroy {
  displayedColumns = ['Id','name','email','phone','DeptName','action'];
  dataSource = new MatTableDataSource<Worker>();
  workerSortSubscription:Subscription;
  constructor(private workerService:WorkerService,
              private departmentService:DepartmentService,
              private router:Router,private dialog:MatDialog) { }

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  ngOnInit() {
    //We might not get the data from the workers table since it's calling asynchronously.
    //So we should do all the initialization task inside findDepartments function.
    this.findDepartments();
    //Since findWorkers is dependent on findDepartments. so we should call findWorkers in the findDepartments function.
  }
  Navigate()
  {
    this.router.navigateByUrl('new-worker');
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style','display:flex');
    this.workerSortSubscription = this.sort.sortChange.subscribe(() => {
      this.dataSource.sortData(this.dataSource.filteredData,this.sort);
    });
  }
  doFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onEditWorker(workerId:number)
  {
    this.router.navigate(['/edit-worker',workerId]);
  }
  onPrintAll(){
    this.workerService.printWorkers = this.dataSource.filteredData;
    this.printWorker();
  }
  printWorker() {
    let columns = [
      {title: "Name", dataKey: "name"},
      {title: "Email", dataKey: "email"},
      {title:"Phone",dataKey:"phone"},
      {title:"Department",dataKey:"DeptName"}
    ];
    let rows = this.workerService.printWorkers;
    let doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows, {
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text("Workers", 40, 30);
      }
    });
    doc.save('workers.pdf');
  }
  onDeleteWorker(workerId:number)
  {
    const dialogRef = this.dialog.open(DeleteComponent,{
      data:{
        id:workerId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.removeWorker(workerId);
      }
    });
  }
  findWorkers () {
    this.workerService.findWorkers().then(
      (workers) => {
        this.workerService.workers = workers;
        this.dataSource.data = this.workerService.getWorkers();
        let self = this;
        this.workerService.workers.forEach(function (worker) {
          worker.DeptName = self.departmentService.getDeptById(worker.DeptId);
        });
      },
      (err) => {
        console.log(err);
      }
    )
  }
  findDepartments () {
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
  removeWorker (workerId) {
    this.workerService.removeWorker(workerId).then(
      () => {
        this.findWorkers();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngOnDestroy() {
    this.workerSortSubscription.unsubscribe();
  }

}
