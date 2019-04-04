import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Asset} from "../../models/asset";
import {AssetService} from "../../services/asset.service";
import {Router} from "@angular/router";
import {DeleteComponent} from "../delete/delete.component";
import {BuildingService} from "../../services/building.service";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";
declare var jsPDF: any;

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit,AfterViewInit,OnDestroy {

  displayedColumns = ['Id','name','model','serial','date','buildingName','action'];
  dataSource = new MatTableDataSource<Asset>();
  assetSortSubscription:Subscription;

  constructor(private assetService:AssetService,
              private buildingService:BuildingService,
              private router:Router,
              private dialog:MatDialog) { }

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  ngOnInit() {
    //First find the data form the database and then set the datasource
    this.findBuildings();

    //We might not get the data from the assets table since it's calling asynchronously.
    //So we should do rest of the task inside findAssets function.
  }
  Navigate()
  {
    this.router.navigateByUrl('new-asset');
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style','display:flex');
    this.assetSortSubscription = this.sort.sortChange.subscribe(() => {
      this.dataSource.sortData(this.dataSource.filteredData,this.sort);
    });
  }
  doFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  findAssets () {
    this.assetService.findAssets().then(
      (assets) => {
        this.assetService.assets = assets;
        var self = this;
        this.assetService.assets.forEach(function (asset) {
          asset.buildingName = self.buildingService.getBuildingById(asset.buildingId);
        });
        this.dataSource.data = this.assetService.assets;
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
        this.findAssets();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  removeAsset (assetId) {
    this.assetService.removeAsset(assetId).then(
      () => {
        this.findAssets();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  onEditAsset(assetId:number)
  {
    this.router.navigate(['/edit-asset',assetId]);
  }
  onPrintAll(){
    this.assetService.printAssets = this.dataSource.filteredData;
    this.printAsset();
  }
  printAsset() {
    //Format the date
    let datePipe = new DatePipe('en-US');
    this.assetService.printAssets.forEach(function (asset) {
      asset.date = datePipe.transform(asset.date, 'dd/MM/yyyy');
    });

    let columns = [
      {title: "ID", dataKey: "Id"},
      {title: "Name", dataKey: "name"},
      {title: "Model", dataKey: "model"},
      {title:"Serial",dataKey:"serial"},
      {title:"Acquisition",dataKey:"date"},
      {title:"Building",dataKey:"buildingName"}
    ];
    let rows = this.assetService.printAssets;
    let doc = new jsPDF('p', 'pt');
    doc.setFontSize(20);
    doc.text(30, 30, 'Table');

    doc.autoTable(columns, rows, {
      margin: {top: 50, left: 20, right: 20, bottom: 0},
      drawHeaderCell: function (cell, data) {
        cell.styles.textColor = 255;
        cell.styles.fontSize = 9;
      },
      createdCell: function (cell, data) {
        cell.styles.fontSize = 6;
        cell.styles.textColor = [0, 0, 0];
      }
    });
    doc.save('assets.pdf');
  }
  onDeleteAsset(assetId:number)
  {
    const dialogRef = this.dialog.open(DeleteComponent,{
      data:{
        id:assetId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.removeAsset(assetId);
      }
    });
    console.log(assetId);
  }

  ngOnDestroy() {
    this.assetSortSubscription.unsubscribe();
  }

}
