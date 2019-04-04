import {Timeworked} from "./timeworked";

export interface Workorder {
  Id:number,
  departmentId?:number,
  departmentName?:string,
  workerId?:number,
  workerName?:string,
  description:string,
  buildingCheck?:boolean,
  buildingId?:number,
  assetId:number,
  assetName?:string,
  requestedBy:string,
  amount?:number,
  dateIssue:Date,
  dateCompleted?:Date,
  status:string,
  residentCheck?:boolean,
  residentId:number,
  residentName?:string
  room?:number,
  phone?:string
  timeWorked:number,
  workersTimeWorked?:Timeworked[],
  comment?:string
}
