import {Resident} from "../models/resident";

declare var require: any;
let Datastore = require('nedb');

export class ResidentService {

  public residentsTable;

  constructor() {
    //Initializing the workorders database to use it.
    this.residentsTable = new Datastore({filename: 'residents.db', autoload: true});
  }

  public residents: any = [];
  public printResidents: any = [];

  getResidents() {
    return this.residents;
  }

  getResident(residentId: number) {
    let resident = this.residents.find(res => res.Id === residentId);
    return resident;
  }

  getResidentByBuildingRoom(buildingId: number, room: number) {
    return this.residents.find(res => res.buildingId === buildingId && res.room === room);
  }

  getMaxId() {
    let resident_id = localStorage.getItem('resident_id');
    if (!this.IsNullOrEmpty(resident_id)) {
      return resident_id + 1;
    }
    if (this.residents.length == 0) {
      return 1;
    }
    let max = this.residents[0].Id;

    for (let i = 1, len = this.residents.length; i < len; i++) {
      let v = this.residents[i].Id;
      max = (v > max) ? v : max;
    }

    return max + 1;
  }
  IsNullOrEmpty(obj) {
    return typeof obj === 'undefined' || obj === null;
  }

  getBuildingRoomPhone(residentId: number) {
    let resident = this.residents.find(res => res.Id === residentId);
    let room = (typeof resident != "undefined") ? resident.room : null;
    let phone = (typeof resident != "undefined") ? resident.phone : '';
    let building = (typeof resident != "undefined") ? resident.buildingId : null;
    return {room: room, phone: phone, building: building};
  }

  getRoomPhone(residentId: number, buildingId: number) {
    let resident = this.residents.find(res => res.Id === residentId && res.buildingId === buildingId);
    let room = (typeof resident != "undefined") ? resident.room : null;
    let phone = (typeof resident != "undefined") ? resident.phone : '';

    return {room: room, phone: phone};
  }

  getResidentById(residentId: number) {
    let resident = this.residents.find(res => res.Id === residentId);
    return (typeof resident != "undefined") ? resident.name : '';
  }

  //---------------------------------------------------------------
  //CRUD assets
  //---------------------------------------------------------------

  //Inserts a new item to the assetTable.
  insertResident(item) {
    return new Promise((resolve, reject) => {
      return this.residentsTable.insert(item, ((err, newItem) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(newItem);
        }
      }))
    });
  }

  //Find all the assets in the table.
  findResidents() {
    return new Promise((resolve, reject) => {
      return this.residentsTable.find({}, ((err, items) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(items);
        }
      }));
    })
  }

  removeResident(residentId) {
    return new Promise((resolve, reject) => {
      return this.residentsTable.remove({Id: residentId}, {}, ((err, numRemoved) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(numRemoved);
        }
      }));
    })
  }

  updateResident(residentId: number, resident: Resident) {
    return new Promise((resolve, reject) => {
      return this.residentsTable.update({Id: residentId}, {
        $set:
          {
            Id: resident.Id,
            name: resident.name,
            room: resident.room,
            phone: resident.phone,
            buildingId: resident.buildingId
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
