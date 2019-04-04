import {Component, OnInit, ViewChild} from '@angular/core';
import {Department} from "../../models/department";
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Router} from "@angular/router";
import {BuildingService} from "../../services/building.service";
import {DeleteComponent} from "../delete/delete.component";

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {
  displayedColumns = ['Id','name','action'];
  dataSource = new MatTableDataSource<Department>();
  constructor(private router:Router,
              private buildingService:BuildingService,
              private dialog:MatDialog) { }
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  ngOnInit() {
    this.findBuildings();
  }
  Navigate()
  {
    this.router.navigateByUrl('new-building');
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onEditBuilding(buildingId:number)
  {
    this.router.navigate(['/edit-building',buildingId]);
  }
  onDeleteBuilding(buildingId:number)
  {
    const dialogRef = this.dialog.open(DeleteComponent,{
      data:{
        id:buildingId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.removeBuilding(buildingId);
      }
    });

    console.log(buildingId)
  }
  findBuildings () {
    this.buildingService.findBuildings().then(
      (buildings) => {
        this.buildingService.buildings = buildings;
        this.dataSource.data = this.buildingService.getBuildings();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  removeBuilding (buildingId) {
    this.buildingService.removeBuilding(buildingId).then(
      () => {
        this.findBuildings();
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
