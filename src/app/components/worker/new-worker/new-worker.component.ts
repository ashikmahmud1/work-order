import { Component, OnInit } from '@angular/core';
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";
import {Worker} from "../../../models/worker";
import {WorkerService} from "../../../services/worker.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-worker',
  templateUrl: './new-worker.component.html',
  styleUrls: ['./new-worker.component.css']
})
export class NewWorkerComponent implements OnInit {


  worker:Worker = {Id:null,name:'',email:'',phone:'',DeptId:null};
  departments:Department[];

  constructor(private departmentService:DepartmentService,
              private workerService:WorkerService,
              private router:Router) { }

  ngOnInit() {
    this.findWorkers();
    this.findDepartments();
  }
  checkDeptId()
  {
    console.log(this.worker.DeptId);
  }
  onSubmit()
  {
    this.addWorker(this.worker);

  }
  findWorkers () {
    this.workerService.findWorkers().then(
      (workers) => {
        //set the workers
        this.workerService.workers = workers;
        //set the departments

        this.worker.Id = this.workerService.getMaxId();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  addWorker (worker) {
    this.workerService.insertWorker(worker).then(
      () => {
        // here set the asset id in the localStorage
        localStorage.setItem('worker_id', worker.Id);
        //redirect to the all worker component
        this.router.navigateByUrl('worker');
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
        this.departments = this.departmentService.departments
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
