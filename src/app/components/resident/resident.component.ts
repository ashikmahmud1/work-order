import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Resident} from "../../models/resident";
import {ResidentService} from "../../services/resident.service";
import {Router} from "@angular/router";
import {DeleteComponent} from "../delete/delete.component";
import {BuildingService} from "../../services/building.service";
import {Subscription} from "rxjs";
declare var jsPDF: any;

@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.css']
})
export class ResidentComponent implements OnInit,AfterViewInit,OnDestroy {
  displayedColumns = ['Id','name','buildingName','room','phone','action'];
  dataSource = new MatTableDataSource<Resident>();
  residentSortSubscription:Subscription;
  constructor(private residentService: ResidentService,
              private buildingService:BuildingService,
              private router:Router,
              private dialog:MatDialog) {}
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  ngOnInit() {
    this.findBuildings();
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style','display:flex');
    this.residentSortSubscription = this.sort.sortChange.subscribe(() => {
      this.dataSource.sortData(this.dataSource.filteredData,this.sort);
    });
  }
  doFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  Navigate()
  {
    this.router.navigateByUrl('new-resident');
  }
  onEditResident(residentId:number)
  {
    this.router.navigate(['/edit-resident',residentId]);
  }
  onPrintAll(){
    //set the filter data
    this.residentService.printResidents = this.dataSource.filteredData;
    this.printResident();
  }
  printResident() {
    let columns = [
      {title: "ID", dataKey:"Id"},
      {title: "Name", dataKey: "name"},
      {title: "Location", dataKey: "buildingName"},
      {title:"Room",dataKey:"room"},
      {title:"Phone",dataKey:"phone"}
    ];
    let rows = this.residentService.printResidents;
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
        cell.styles.fontSize = 7;
        cell.styles.textColor = [0, 0, 0];
      }
    });
    doc.save('residents.pdf');
  }
  onDeleteResident(residentId:number)
  {
    const dialogRef = this.dialog.open(DeleteComponent,{
      data:{
        id:residentId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.removeResident(residentId);
      }
    });
  }

  findResidents () {
    this.residentService.findResidents().then(
      (residents) => {
        this.residentService.residents = residents;
        var self = this;
        this.residentService.residents.forEach(function (resident) {
          resident.buildingName = self.buildingService.getBuildingById(resident.buildingId);
        });
        this.dataSource.data = this.residentService.getResidents();
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
        this.findResidents();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  removeResident (residentId) {
    this.residentService.removeResident(residentId).then(
      () => {
        this.findResidents();
        //delete all the workers associated with this department
      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngOnDestroy() {
    this.residentSortSubscription.unsubscribe();
  }
}
