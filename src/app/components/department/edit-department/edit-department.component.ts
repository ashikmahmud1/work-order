import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";
import {EditComponent} from "../../edit/edit.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {

  departmentId:number;
  department:Department;
  constructor(private route:ActivatedRoute,
              private departmentService:DepartmentService,
              private router:Router,private dialog:MatDialog) { }

  ngOnInit() {
    this.departmentId = + this.route.snapshot.paramMap.get('id');
    this.department = this.departmentService.getDepartment(this.departmentId);
    console.log(this.department);
  }
  onSubmit()
  {
    const dialogRef = this.dialog.open(EditComponent,{
      data:{
        id:this.departmentId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        //update the data
        this.updateDepartment(this.departmentId,this.department);
        //Navigate to the worker table
      }
    });

  }
  updateDepartment(deptId:number, department:Department){
    this.departmentService.updateDepartment(deptId,department).then(
      () => {
        //OnSuccess Redirect to worker table
        this.router.navigateByUrl('department');
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
