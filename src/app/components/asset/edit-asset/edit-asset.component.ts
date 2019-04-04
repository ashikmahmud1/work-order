import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Asset} from "../../../models/asset";
import {AssetService} from "../../../services/asset.service";
import {EditComponent} from "../../edit/edit.component";
import {MatDialog} from "@angular/material";
import {Building} from "../../../models/building";
import {BuildingService} from "../../../services/building.service";

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.css']
})
export class EditAssetComponent implements OnInit {

  assetId:number;
  asset:Asset;
  buildings:Building[];
  constructor(private route:ActivatedRoute,
              private assetService:AssetService,
              private buildingService:BuildingService,
              private router:Router,
              private dialog:MatDialog) { }

  ngOnInit() {
    this.assetId = + this.route.snapshot.paramMap.get('id');
    this.buildings = this.buildingService.getBuildings();
    this.asset = this.assetService.getAsset(this.assetId);
    console.log(this.asset);
  }
  onSubmit()
  {
    const dialogRef = this.dialog.open(EditComponent,{
      data:{
        id:this.assetId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        //update the data
        this.updateAsset(this.assetId,this.asset)
        //Navigate to the asset table
      }
    });

  }
  updateAsset (assetId:number, asset:Asset){
    this.assetService.updateAsset(assetId,asset).then(
      () => {
        //OnSuccess Redirect to worker table
        this.router.navigateByUrl('asset');
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
