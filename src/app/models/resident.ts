export interface Resident {
  Id: number,
  name: string,
  buildingId?:number,
  buildingName?:string,
  room?: number,
  phone?: string
}
