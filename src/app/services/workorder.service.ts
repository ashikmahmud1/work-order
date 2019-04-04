import {Workorder} from "../models/workorder";

declare var require: any;
let Datastore = require('nedb');

export class WorkorderService {

  public workOrdersTable;

  constructor() {
    //Initializing the workorders database to use it.
    this.workOrdersTable = new Datastore({filename: 'workorders.db', autoload: true});
  }

  public workOrders: any = [];

  public printWorkOrders: any = [];

  public printWorkOrder:Workorder;

  public printReport:any;

  public filteredWorkOrders: any = [];

  getWorkOrders() {
    return this.workOrders;
  }

  getWorkOrder(workOrderId: number) {
    return this.workOrders.find(workOrder => workOrder.Id === workOrderId);
  }

  getMaxId() {
    let work_id = localStorage.getItem('work_id');
    if (!this.IsNullOrEmpty(work_id)) {
      return work_id + 1;
    }
    if (this.workOrders.length == 0) {
      return 1;
    }
    let max = this.workOrders[0].Id;

    for (let i = 1, len = this.workOrders.length; i < len; i++) {
      let v = this.workOrders[i].Id;
      max = (v > max) ? v : max;
    }
    return max + 1;
  }
  IsNullOrEmpty(obj) {
    return typeof obj === 'undefined' || obj === null;
  }

  //---------------------------------------------------------------
  //CRUD workorders
  //---------------------------------------------------------------

  //Inserts a new item to the assetTable.
  insertWorkOrder(item) {
    return new Promise((resolve, reject) => {
      return this.workOrdersTable.insert(item, ((err, newItem) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(newItem);
        }
      }))
    });
  }

  //Find all the workOrders in the table.
  findWorkOrders() {
    return new Promise((resolve, reject) => {
      return this.workOrdersTable.find({}, ((err, items) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(items);
        }
      }));
    })
  }

  removeWorkOrder(workOrderId) {
    return new Promise((resolve, reject) => {
      return this.workOrdersTable.remove({Id: workOrderId}, {}, ((err, numRemoved) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(numRemoved);
        }
      }));
    })
  }

  updateWorkOrder(workOrderId: number, workOrder: Workorder) {
    return new Promise((resolve, reject) => {
      return this.workOrdersTable.update({Id: workOrderId}, {
        $set:
          {
            Id: workOrder.Id,
            departmentId: workOrder.departmentId,
            workerId: workOrder.departmentId,
            description: workOrder.description,
            assetId: workOrder.assetId,
            requestedBy: workOrder.requestedBy,
            workersTimeWorked:workOrder.workersTimeWorked,
            dateIssue: workOrder.dateIssue,
            dateCompleted: workOrder.dateCompleted,
            status: workOrder.status,
            amount: workOrder.amount,
            residentId: workOrder.residentId,
            room: workOrder.room,
            phone: workOrder.phone,
            timeWorked: workOrder.timeWorked,
            buildingId: workOrder.buildingId,
            buildingCheck: workOrder.buildingCheck,
            residentCheck: workOrder.residentCheck,
            comment: workOrder.comment
          }
      }, ((err: any, NumReplaced: any) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(NumReplaced);
        }
      }));
    })
  }
}
