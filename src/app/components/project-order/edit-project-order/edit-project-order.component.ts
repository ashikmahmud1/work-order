import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Timeworked} from "../../../models/timeworked";
import {Resident} from "../../../models/resident";
import {Building} from "../../../models/building";
import {Projectorder} from "../../../models/projectorder";
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Asset} from "../../../models/asset";
import {ResidentService} from "../../../services/resident.service";
import {AssetService} from "../../../services/asset.service";
import {ProjectorderService} from "../../../services/projectorder.service";
import {BuildingService} from "../../../services/building.service";
import {EditComponent} from "../../edit/edit.component";
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";

@Component({
  selector: 'app-edit-project-order',
  templateUrl: './edit-project-order.component.html',
  styleUrls: ['./edit-project-order.component.css']
})
export class EditProjectOrderComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  projectOrderId: number;
  isBuilding: boolean = false;
  isResident: boolean = false;
  projectOrder: Projectorder;
  displayedColumns = ['worker', 'date', 'time-worked'];
  dateWorked: Timeworked[] = [];
  dataSource = new MatTableDataSource<Timeworked>();
  assets: Asset[];
  buildings: Building[];
  residents: Resident[];
  departments: Department[];

  constructor(private route: ActivatedRoute,
              private buildingService: BuildingService,
              private residentService: ResidentService,
              private assetService: AssetService,
              private projectOrderService: ProjectorderService,
              private departmentService: DepartmentService,
              private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.projectOrderId = +this.route.snapshot.paramMap.get('id');
    this.buildings = this.buildingService.getBuildings();
    this.assets = this.assetService.getAssets();
    this.residents = this.residentService.getResidents();
    this.residents.sort(function (a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    this.departments = this.departmentService.getDepartments();
    this.projectOrder = this.projectOrderService.getProjectOrder(this.projectOrderId);
    this.dateWorked = this.projectOrder.dateTimeWorked;
    console.log(this.projectOrder.dateTimeWorked);
    this.isBuilding = (typeof this.projectOrder.buildingCheck != "undefined") ? this.projectOrder.buildingCheck : false;
    this.isResident = (typeof this.projectOrder.residentCheck != "undefined") ? this.projectOrder.residentCheck : false;
    this.dataSource.data = this.dateWorked;
  }

  onSubmit() {
    const dialogRef = this.dialog.open(EditComponent, {
      data: {
        id: this.projectOrderId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //update the data
        //set the isBuilding and isResident property
        this.projectOrder.residentCheck = this.isResident;
        this.projectOrder.buildingCheck = this.isBuilding;
        //Update the dateTimeWorked with the edited dateWorked
        this.projectOrder.dateTimeWorked = this.dateWorked;

        this.updateProjectOrder(this.projectOrderId, this.projectOrder);
        //Navigate to the worker table
      }
    });

  }

  onPrintProjectOrder() {
    //print the project order
    this.projectOrderService.printProjectOrder = this.projectOrder;
    this.router.navigate(['/print-project-order', 'edit-work-order']);
  }

  onFillRoomPhone() {
    if (this.projectOrder.residentId !==null && this.projectOrder.buildingId !==null){
      //fill the room and phone for the newWrokOrder
      let resident = this.residentService.getRoomPhone(this.projectOrder.residentId,this.projectOrder.buildingId);
      this.projectOrder.room = resident.room;
      this.projectOrder.phone = resident.phone;
    }
  }
  onChangeResident() {
    //get room and phone building;
    let resident = this.residentService.getBuildingRoomPhone(this.projectOrder.residentId);
    this.projectOrder.room = resident.room;
    this.projectOrder.phone = resident.phone;
    this.projectOrder.buildingId = resident.building;
  }
  //
  onChangeRoom() {
    //check building property and room and get the resident
    //set the residentId
    if (this.projectOrder.buildingId != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.projectOrder.buildingId, this.projectOrder.room);
      this.projectOrder.residentId = (typeof resident != "undefined") ? resident.Id : this.projectOrder.residentId;
      //also set the phone number
      this.projectOrder.phone = (typeof resident != "undefined") ? resident.phone : this.projectOrder.phone;
    }
  }

  onChangeBuilding() {
    //check building property and room and get the resident
    //set the residentId
    if (this.projectOrder.room != null) {
      let resident = this.residentService.getResidentByBuildingRoom(this.projectOrder.buildingId, this.projectOrder.room);
      this.projectOrder.residentId = (typeof resident != "undefined") ? resident.Id : null;
      //also set the phone number
      this.projectOrder.phone = (typeof resident != "undefined") ? resident.phone : '';
      this.projectOrder.room = (typeof resident != "undefined") ? resident.room : null;
    }
  }

  updateDateWorked(dateWorked,workerId) {
    let index = this.dateWorked.findIndex((w => w.workerId == workerId));
    this.dateWorked[index].dateWorked = dateWorked;
    console.log(this.dateWorked);
  }

  updateTimeWorked(timeWorked,workerId) {
    let index = this.dateWorked.findIndex((w => w.workerId == workerId));
    this.dateWorked[index].timeWorked = timeWorked;
    console.log(this.dateWorked)
  }

  updateProjectOrder(projectOrderId: number, projectOrder: Projectorder) {
    this.projectOrderService.updateProjectOrder(projectOrderId, projectOrder).then(
      () => {
        //OnSuccess Redirect to worker table
        this.router.navigateByUrl('');
      },
      (err) => {
        console.log(err);
      }
    )
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style', 'display:flex');
  }

}
