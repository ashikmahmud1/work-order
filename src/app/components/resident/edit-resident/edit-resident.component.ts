import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Resident} from "../../../models/resident";
import {ResidentService} from "../../../services/resident.service";
import {EditComponent} from "../../edit/edit.component";
import {MatDialog} from "@angular/material";
import {Building} from "../../../models/building";
import {BuildingService} from "../../../services/building.service";

@Component({
  selector: 'app-edit-resident',
  templateUrl: './edit-resident.component.html',
  styleUrls: ['./edit-resident.component.css']
})
export class EditResidentComponent implements OnInit {

  residentId:number;
  resident:Resident;
  buildings:Building[];
  constructor(private route:ActivatedRoute,
              private residentService:ResidentService,
              private buildingService:BuildingService,
              private router:Router,private dialog:MatDialog) { }

  ngOnInit() {
    this.residentId = + this.route.snapshot.paramMap.get('id');
    this.resident = this.residentService.getResident(this.residentId);
    this.buildings = this.buildingService.getBuildings();
    console.log(this.resident);
  }
  onSubmit()
  {
    const dialogRef = this.dialog.open(EditComponent,{
      data:{
        id:this.residentId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        //update the data
        this.updateResident(this.residentId,this.resident);
        //Navigate to the worker table
      }
    });

  }
  updateResident (residentId:number, resident:Resident){
    this.residentService.updateResident(residentId,resident).then(
      () => {
        //OnSuccess Redirect to worker table
        this.router.navigateByUrl('resident');
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
