import {Worker} from "../models/worker";

declare var require: any;
let Datastore = require('nedb');


export class WorkerService {

  public workersTable;

  constructor()
  {
    //Initializing the workers database to use it.
    this.workersTable = new Datastore({ filename: 'workers.db', autoload: true });
  }

  public workers:any = [];
  public printWorkers:any = [];

  getWorkers()
  {
    return this.workers;
  }
  getMaxId()
  {
    let worker_id = localStorage.getItem('worker_id');
    if (!this.IsNullOrEmpty(worker_id)) {
      return worker_id + 1;
    }
    if(this.workers.length == 0)
    {
      return 1;
    }
    let max = this.workers[0].Id;

    for (let i = 1, len=this.workers.length; i < len; i++) {
      let v = this.workers[i].Id;
      max = (v > max) ? v : max;
    }

    return  max + 1;
  }
  IsNullOrEmpty(obj) {
    return typeof obj === 'undefined' || obj === null;
  }
  getWorker(workerId:number)
  {
    return this.workers.find(worker => worker.Id === workerId);
  }
  getWorkerById(workerId:number)
  {
    //get Department from the department service
    let worker = this.workers.find(worker => worker.Id===workerId);

    return (typeof worker != 'undefined')? worker.name : '';
  }

  //---------------------------------------------------------------
  //CRUD workers
  //---------------------------------------------------------------

  //Inserts a new item to the assetTable.
  insertWorker(item) {
    return new Promise((resolve, reject) => {
      return this.workersTable.insert(item, ((err, newItem) => {
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

  //Find all the assets in the table.
  findWorkers() {
    return new Promise((resolve, reject) => {
      return this.workersTable.find({}, ((err, items) => {
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

  removeWorker(workerId) {
    return new Promise((resolve, reject) => {
      return this.workersTable.remove({ Id: workerId }, {}, ((err, numRemoved) => {
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

  removeWorkerByDept(DeptId) {
    return new Promise((resolve, reject) => {
      return this.workersTable.remove({ DeptId: DeptId }, {multi: true}, ((err, numRemoved) => {
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

  updateWorker(workerId:number,worker:Worker) {
    return new Promise((resolve, reject) => {
      return this.workersTable.update({Id:workerId},{$set:
          {Id:worker.Id,name:worker.name,email:worker.email,phone:worker.phone,DeptId:worker.DeptId}}, ((err:any, NumReplaced:any) => {
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
