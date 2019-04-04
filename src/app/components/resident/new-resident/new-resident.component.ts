import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Resident} from "../../../models/resident";
import {ResidentService} from "../../../services/resident.service";
import {Building} from "../../../models/building";
import {BuildingService} from "../../../services/building.service";

@Component({
  selector: 'app-new-resident',
  templateUrl: './new-resident.component.html',
  styleUrls: ['./new-resident.component.css']
})
export class NewResidentComponent implements OnInit {

  resident: Resident = {Id:null,name:'',room:null,phone:''};
  buildings:Building[];
  constructor(private router:Router,
              private residentService:ResidentService,
              private buildingService:BuildingService) { }

  ngOnInit() {
    this.findResidents();
  }
  onSubmit()
  {
    this.addResident(this.resident);
    this.router.navigateByUrl('resident');
  }
  onChange()
  {
    console.log(this.resident.room)
  }
  findResidents () {
    this.residentService.findResidents().then(
      (residents) => {
        this.residentService.residents = residents;
        this.resident.Id = this.residentService.getMaxId();
        this.findBuildings();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  findBuildings () {
    this.buildingService.findBuildings().then(
      (buildings) => {
        this.buildingService.buildings = buildings;
        this.buildings = this.buildingService.buildings;
      },
      (err) => {
        console.log(err);
      }
    )
  }
  addResident (resident) {
    this.residentService.insertResident(resident).then(
      () => {
        // here set the resident id in the localStorage
        localStorage.setItem('resident_id', resident.Id);
        this.findResidents();
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
