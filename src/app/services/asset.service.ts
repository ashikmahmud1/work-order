import {Asset} from "../models/asset";

declare var require: any;
let Datastore = require('nedb');

export class AssetService {

  public assetsTable;

  constructor() {
    //Initializing the assets table to use it.
    this.assetsTable = new Datastore({filename: 'assets.db', autoload: true});
  }

  public assets: any = [];
  public printAssets: any = [];

  getAssets() {
    return this.assets;
  }

  getAsset(assetId: number) {
    return this.assets.find(asset => asset.Id === assetId);
  }

  getMaxId() {
    // first check the localStorage
    let asset_id = localStorage.getItem('asset_id');
    // if the localStorage have asset_id then add 1 with the asset_id
    if (!this.IsNullOrEmpty(asset_id)) {
      return asset_id + 1;
    }
    // and return the asset_id
    // if the localStorage asset_id is null or undefined
    // then execute the below functionality
    if (this.assets.length == 0) {
      return 1;
    }
    let max = this.assets[0].Id;

    for (let i = 1, len = this.assets.length; i < len; i++) {
      let v = this.assets[i].Id;
      max = (v > max) ? v : max;
    }

    return max + 1;
  }

  IsNullOrEmpty(obj) {
    return typeof obj === 'undefined' || obj === null;
  }

  getAssetById(assetId: number) {
    let asset = this.assets.find(asset => asset.Id === assetId);
    return (typeof asset != "undefined") ? asset.name : '';
  }


  //---------------------------------------------------------------
  //CRUD assets
  //---------------------------------------------------------------

  //Inserts a new item to the assetTable.
  insertAsset(item) {
    return new Promise((resolve, reject) => {
      return this.assetsTable.insert(item, ((err, newItem) => {
        if (err) {
          reject(err);
        } else {
          resolve(newItem);
        }
      }))
    });
  }

  //Find all the assets in the table.
  findAssets() {
    return new Promise((resolve, reject) => {
      return this.assetsTable.find({}, ((err, items) => {
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      }));
    })
  }

  removeAsset(assetId) {
    return new Promise((resolve, reject) => {
      return this.assetsTable.remove({Id: assetId}, {}, ((err, numRemoved) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      }));
    })
  }

  updateAsset(assetId: number, asset: Asset) {
    return new Promise((resolve, reject) => {
      return this.assetsTable.update({Id: assetId}, {
        $set:
          {
            Id: asset.Id,
            name: asset.name,
            type: asset.type,
            model: asset.model,
            serial: asset.serial,
            date: asset.date,
            buildingId: asset.buildingId,
            room: asset.room
          }
      }, ((err: any, NumReplaced: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(NumReplaced);
        }
      }));
    })
  }
}
