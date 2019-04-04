export interface Asset {
  Id:number,
  name:string,
  type?:string,
  model?:string,
  serial?:string,
  date?:Date
  buildingId?:number,
  buildingName?:string,
  room?:number
}
