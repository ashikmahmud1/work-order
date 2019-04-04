import { Component, OnInit } from '@angular/core';
import {Building} from "../../../models/building";
import {BuildingService} from "../../../services/building.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-building',
  templateUrl: './new-building.component.html',
  styleUrls: ['./new-building.component.css']
})
export class NewBuildingComponent implements OnInit {

  building:Building = {Id:null,name:''};
  constructor(private buildingService:BuildingService,private router:Router) { }

  ngOnInit() {
    this.findBuildings();
  }
  onSubmit()
  {
    this.addBuilding(this.building);
    //navigate to all departments component
    this.router.navigateByUrl('building');
  }
  findBuildings () {
    this.buildingService.findBuildings().then(
      (buildings) => {
        this.buildingService.buildings = buildings;
        //Generate new Id
        this.building.Id = this.buildingService.getMaxId();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  addBuilding (building) {
    this.buildingService.insertBuilding(building).then(
      () => {
        // here set the building id in the localStorage
        localStorage.setItem('building_id', building.Id);
        this.findBuildings()
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
