import {Component, OnInit} from '@angular/core';
import {Asset} from "../../../models/asset";
import {AssetService} from "../../../services/asset.service";
import {Router} from "@angular/router";
import {Building} from "../../../models/building";
import {BuildingService} from "../../../services/building.service";

@Component({
  selector: 'app-new-asset',
  templateUrl: './new-asset.component.html',
  styleUrls: ['./new-asset.component.css']
})
export class NewAssetComponent implements OnInit {

  asset: Asset = {Id: null, name: '', type: '', model: '', serial: '', date: new Date(), room: null, buildingId: null};
  buildings: Building [];

  constructor(private assetService: AssetService,
              private buildingService: BuildingService,
              private router: Router) {
  }

  ngOnInit() {

    //First find all the assets and set in the assets array.
    this.findAssets();

    //We might not get the data from the assets table since it's calling asynchronously.
    //So we should called the getMaxId function inside findAssets function.
  }

  findAssets() {
    this.assetService.findAssets().then(
      (assets) => {
        this.assetService.assets = assets;
        //Generate new Id
        this.asset.Id = this.assetService.getMaxId();
        this.findBuildings();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findBuildings() {
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

  onSubmit() {
    this.addAsset(this.asset);
    this.router.navigateByUrl('asset');
  }

  addAsset(asset) {
    this.assetService.insertAsset(asset).then(
      () => {
        // here set the asset id in the localStorage
        localStorage.setItem('asset_id', asset.Id);
        this.findAssets();
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
