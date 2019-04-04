import {Timeworked} from "./timeworked";


export interface Projectorder {
  Id:number,
  departmentId?:number,
  departmentName?:string,
  buildingId?:number,
  assetId:number,
  assetName?:string,
  requestedBy:string,
  amount?:number,
  description?:string,
  dateIssue:Date,
  dateCompleted?:Date,
  residentId:number,
  residentName?:string,
  room?:number,
  phone?:string,
  buildingCheck?:boolean,
  residentCheck?:boolean
  dateTimeWorked:Timeworked[]
}
