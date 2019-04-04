import { Component, OnInit } from '@angular/core';
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.css']
})
export class NewDepartmentComponent implements OnInit {

  department: Department = {Id:null,name:'',subcontractor:''};
  constructor(private departmentService:DepartmentService,private router:Router) { }

  ngOnInit() {

    //We might not get the data from the assets table since it's calling asynchronously.
    //So we should do all the initialization task inside findDepartments function.
    this.findDepartments();
    console.log(this);

  }
  onSubmit()
  {
    this.addDepartment(this.department);

    //navigate to all departments component
    this.router.navigateByUrl('department')

  }
  findDepartments () {
    this.departmentService.findDepartments().then(
      (departments) => {
        this.departmentService.departments = departments;
        //Generate new Id
        this.department.Id = this.departmentService.getMaxId();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  addDepartment (department) {
    this.departmentService.insertDepartment(department).then(
      () => {
        // here set the department id in the localStorage
        localStorage.setItem('department_id', department.Id);
        this.findDepartments();
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
