import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Worker} from "../../../models/worker";
import {WorkerService} from "../../../services/worker.service";
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";
import {DeleteComponent} from "../../delete/delete.component";
import {MatDialog} from "@angular/material";
import {EditComponent} from "../../edit/edit.component";

@Component({
  selector: 'app-edit-worker',
  templateUrl: './edit-worker.component.html',
  styleUrls: ['./edit-worker.component.css']
})
export class EditWorkerComponent implements OnInit {

  workerId:number;
  worker:Worker;
  departments:Department[] = [];
  constructor(private route:ActivatedRoute,
              private workerService:WorkerService,
              private departmentService:DepartmentService,
              private router:Router,
              private dialog:MatDialog) { }

  ngOnInit() {
    this.workerId = + this.route.snapshot.paramMap.get('id');

    this.departments = this.departmentService.getDepartments();
    //get the worker from the workers array
    this.worker = this.workerService.getWorker(this.workerId);
    this.worker.DeptName = this.departmentService.getDeptById(this.worker.DeptId);
    console.log(this.worker);
  }
  onSubmit()
  {
    const dialogRef = this.dialog.open(EditComponent,{
      data:{
        id:this.workerId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        //update the data
        this.updateWorker(this.workerId,this.worker);
        //Navigate to the worker table
      }
    });
  }
  onChangeDepartmentName()
  {
    this.worker.DeptId = this.departmentService.getDeptByName(this.worker.DeptName);
    console.log(this.worker.DeptId);
  }
  updateWorker (workerId:number, worker:Worker){
    this.workerService.updateWorker(workerId,worker).then(
      () => {
        //OnSuccess Redirect to worker table
        this.router.navigateByUrl('worker');
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
