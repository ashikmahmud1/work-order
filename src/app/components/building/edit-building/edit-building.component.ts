import { Component, OnInit } from '@angular/core';
import {Building} from "../../../models/building";
import {BuildingService} from "../../../services/building.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EditComponent} from "../../edit/edit.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-edit-building',
  templateUrl: './edit-building.component.html',
  styleUrls: ['./edit-building.component.css']
})
export class EditBuildingComponent implements OnInit {

  buildingId:number;
  building:Building;
  constructor(private buildingService:BuildingService,
              private router:Router,
              private dialog:MatDialog,private route:ActivatedRoute) { }

  ngOnInit() {
    this.buildingId = + this.route.snapshot.paramMap.get('id');
    this.building = this.buildingService.getBuilding(this.buildingId);
  }
  onSubmit()
  {
    const dialogRef = this.dialog.open(EditComponent,{
      data:{
        id:this.buildingId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        //update the data
        this.updateBuilding(this.buildingId,this.building);
        //Navigate to the worker table
      }
    });
  }
  updateBuilding(buildingId:number, building:Building){
    this.buildingService.updateBuilding(buildingId,building).then(
      () => {
        //OnSuccess Redirect to worker table
        this.router.navigateByUrl('building');
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
