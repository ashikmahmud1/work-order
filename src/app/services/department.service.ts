import {Department} from "../models/department";

declare var require: any;
let Datastore = require('nedb');

export class DepartmentService {

  public departmentsTable;

  constructor(){
    //Initializing the departments table to use it.
    this.departmentsTable =new Datastore({ filename: 'departments.db', autoload: true });
  }

  public departments:any = [];

  getDepartments()
  {
    return this.departments;
  }
  getDepartment(deptId:number)
  {
    return this.departments.find(dept => dept.Id === deptId);
  }
  getMaxId()
  {
    let department_id = localStorage.getItem('department_id');
    if (!this.IsNullOrEmpty(department_id)) {
      return department_id + 1;
    }
    if(this.departments.length == 0)
    {
      return 1;
    }
    let max = this.departments[0].Id;

    for (let i = 1, len=this.departments.length; i < len; i++) {
      let v = this.departments[i].Id;
      max = (v > max) ? v : max;
    }

    return  max + 1;
  }
  IsNullOrEmpty(obj) {
    return typeof obj === 'undefined' || obj === null;
  }
  getDeptById(deptId:number)
  {
    //get Department from the department service
    let department = this.departments.find(dept => dept.Id===deptId);

    return (typeof department != 'undefined')? department.name : '';
  }
  getDeptByName(deptName:string)
  {
    //get Department from the department service
    let department = this.departments.find(dept => dept.name===deptName);

    return (typeof department != 'undefined')? department.Id : null;
  }

  //---------------------------------------------------------------
  //CRUD departments
  //---------------------------------------------------------------

  //Inserts a new item to the departmentTable.
  insertDepartment(item) {
    return new Promise((resolve, reject) => {
      return this.departmentsTable.insert(item, ((err, newItem) => {
        if ( err )
        {
          reject(err);
        }
        else
        {
          resolve(newItem);
        }
      }))
    });
  }

  //Find all the departments in the table.
  findDepartments() {
    return new Promise((resolve, reject) => {
      return this.departmentsTable.find({}, ((err, items) => {
        if ( err )
        {
          reject(err);
        }
        else
        {
          resolve(items);
        }
      }));
    })
  }

  removeDepartment(departmentId) {
    return new Promise((resolve, reject) => {
      return this.departmentsTable.remove({ Id: departmentId }, {}, ((err, numRemoved) => {
        if ( err )
        {
          reject(err);
        }
        else
        {
          resolve(numRemoved);
        }
      }));
    })
  }

  updateDepartment(departmentId:number,department:Department) {
    return new Promise((resolve, reject) => {
      return this.departmentsTable.update({Id:departmentId},{$set:
          {Id:department.Id,name:department.name,subcontractor:department.subcontractor}}, ((err:any, NumReplaced:any) => {
        if ( err )
        {
          reject(err);
        }
        else
        {
          resolve(NumReplaced);
        }
      }));
    })
  }
}
