import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {Asset} from "../../../models/asset";
import {Projectorder} from "../../../models/projectorder";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {Timeworked} from "../../../models/timeworked";
import {Building} from "../../../models/building";
import {Department} from "../../../models/department";
import {Resident} from "../../../models/resident";
import {AssetService} from "../../../services/asset.service";
import {ProjectorderService} from "../../../services/projectorder.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BuildingService} from "../../../services/building.service";
import {ResidentService} from "../../../services/resident.service";
import {DepartmentService} from "../../../services/department.service";
import {ElectronService} from "ngx-electron";
import {ErrorComponent} from "../../error/error.component";

@Component({
  selector: 'app-print-project-order',
  templateUrl: './print-project-order.component.html',
  styleUrls: ['./print-project-order.component.css']
})
export class PrintProjectOrderComponent implements OnInit,AfterViewInit {

  pageName: string;
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
              private router: Router,
              private dialog: MatDialog,
              private _electronService: ElectronService,
              private _ngZone: NgZone) {
    this._electronService.ipcRenderer.on('wrote-pdf', (event) => {
      this._ngZone.run(() => {
        if (this.pageName === "new-project-order") {
          this.router.navigateByUrl(this.pageName);
        }
        else {
          this.router.navigate(['/edit-project-order', this.projectOrder.Id]);
        }
      });
    });
    this._electronService.ipcRenderer.once('error', (event, error) => {
      this._ngZone.run(() => {
        console.log(error);
        this.dialog.open(ErrorComponent, {
          data: {
            title: "Error",
            body: "There is something wrong"
          }
        });
        if (this.pageName === "new-project-order") {
          this.router.navigateByUrl(this.pageName);
        }
        else {
          this.router.navigate(['/edit-project-order', this.projectOrder.Id]);
        }
      });
    })
  }

  ngOnInit() {
    this.pageName = this.route.snapshot.paramMap.get('name');
    this.projectOrder = this.projectOrderService.printProjectOrder;
    this.buildings = this.buildingService.getBuildings();
    this.assets = this.assetService.getAssets();
    this.residents = this.residentService.getResidents();
    this.departments = this.departmentService.getDepartments();
    this.dateWorked = this.projectOrder.dateTimeWorked;
    this.isBuilding = (typeof this.projectOrder.buildingCheck !="undefined") ? this.projectOrder.buildingCheck : false;
    this.isResident = (typeof this.projectOrder.residentCheck !="undefined") ? this.projectOrder.residentCheck : false;
    this.dataSource.data = this.dateWorked;
  }
  onPrintProjectOrder()
  {
    this._electronService.ipcRenderer.send('print-to-pdf');
  }

  ngAfterViewInit(): void {
    let toolbar = <HTMLInputElement> document.getElementById('mat-toolbar');
    toolbar.setAttribute('style','display:none');
    this.onPrintProjectOrder();
  }

}
