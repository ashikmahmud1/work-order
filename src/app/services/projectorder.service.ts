import {Projectorder} from "../models/projectorder";
declare var require: any;
let Datastore = require('nedb');


export class ProjectorderService {

  public projectOrdersTable;

  constructor() {
    this.projectOrdersTable = new Datastore({ filename: 'projectorders.db', autoload: true });
  }

  public projectOrders:any = [];

  public printProjectOrders:any = [];

  public printProjectOrder:Projectorder;

  public filteredProjectOrders:any = [];

  getProjectOrders()
  {
    return this.projectOrders;
  }
  getProjectOrder(projectOrderId:number)
  {
    return this.projectOrders.find(projectOrder => projectOrder.Id === projectOrderId);
  }
  getMaxId()
  {
    let project_id = localStorage.getItem('project_id');
    if (!this.IsNullOrEmpty(project_id)) {
      return project_id + 1;
    }
    if(this.projectOrders.length == 0)
    {
      return 1;
    }
    let max = this.projectOrders[0].Id;

    for (let i = 1, len=this.projectOrders.length; i < len; i++) {
      let v = this.projectOrders[i].Id;
      max = (v > max) ? v : max;
    }
    return  max + 1;
  }
  IsNullOrEmpty(obj) {
    return typeof obj === 'undefined' || obj === null;
  }

  //---------------------------------------------------------------
  //CRUD projectOrders
  //---------------------------------------------------------------

  //Inserts a new item to the assetTable.
  insertProjectOrder(item) {
    return new Promise((resolve, reject) => {
      return this.projectOrdersTable.insert(item, ((err, newItem) => {
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

  //Find all the project orders in the table.
  findProjectOrders() {
    return new Promise((resolve, reject) => {
      return this.projectOrdersTable.find({}, ((err, items) => {
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

  removeProjectOrder(projectOrderId) {
    return new Promise((resolve, reject) => {
      return this.projectOrdersTable.remove({ Id: projectOrderId }, {}, ((err, numRemoved) => {
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

  updateProjectOrder(projectOrderId:number,projectOrder:Projectorder) {
    return new Promise((resolve, reject) => {
      return this.projectOrdersTable.update({Id:projectOrderId},{$set:
          {Id:projectOrder.Id,departmentId:projectOrder.departmentId,description:projectOrder.description,assetId:projectOrder.assetId,
            requestedBy:projectOrder.requestedBy,amount:projectOrder.amount,
            dateIssue:projectOrder.dateIssue,dateCompleted:projectOrder.dateCompleted,
            residentId:projectOrder.residentId,room:projectOrder.room,phone:projectOrder.phone,
            buildingId:projectOrder.buildingId,buildingCheck:projectOrder.buildingCheck,
            residentCheck:projectOrder.residentCheck,dateTimeWorked:projectOrder.dateTimeWorked
          }}, ((err:any, NumReplaced:any) => {
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
