import {Building} from "../models/building";
declare var require: any;
let Datastore = require('nedb');
export class BuildingService {
  public buildingsTable;
  constructor(){
    //Initializing the departments table to use it.
    this.buildingsTable =new Datastore({ filename: 'buildings.db', autoload: true });
  }
  public buildings:any = [];

  getBuildings()
  {
    return this.buildings;
  }
  getBuilding(buildingId:number)
  {
    let building = this.buildings.find(building => building.Id===buildingId);
    return building;
  }
  getBuildingById(buildingId:number)
  {
    let building = this.buildings.find(building => building.Id===buildingId);
    return (typeof building != 'undefined')? building.name : '';
  }
  getMaxId()
  {
    let building_id = localStorage.getItem('building_id');
    if (!this.IsNullOrEmpty(building_id)) {
      return building_id + 1;
    }
    if(this.buildings.length == 0)
    {
      return 1;
    }
    let max = this.buildings[0].Id;

    for (let i = 1, len=this.buildings.length; i < len; i++) {
      let v = this.buildings[i].Id;
      max = (v > max) ? v : max;
    }

    return  max + 1;
  }

  IsNullOrEmpty(obj) {
    return typeof obj === 'undefined' || obj === null;
  }
  //---------------------------------------------------------------
  //CRUD buildings
  //---------------------------------------------------------------

  //Inserts a new item to the departmentTable.
  insertBuilding(item) {
    return new Promise((resolve, reject) => {
      return this.buildingsTable.insert(item, ((err, newItem) => {
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

  //Find all the buildings in the table.
  findBuildings() {
    return new Promise((resolve, reject) => {
      return this.buildingsTable.find({}, ((err, items) => {
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

  removeBuilding(buildingId) {
    return new Promise((resolve, reject) => {
      return this.buildingsTable.remove({ Id: buildingId }, {}, ((err, numRemoved) => {
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

  updateBuilding(buildingId:number,building:Building) {
    return new Promise((resolve, reject) => {
      return this.buildingsTable.update({Id:buildingId},{$set:
          {Id:building.Id,name:building.name}}, ((err:any, NumReplaced:any) => {
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
