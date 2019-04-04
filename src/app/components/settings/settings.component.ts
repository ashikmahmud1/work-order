import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {AssetService} from "../../services/asset.service";
import {BuildingService} from "../../services/building.service";
import {DepartmentService} from "../../services/department.service";
import {ProjectorderService} from "../../services/projectorder.service";
import {ResidentService} from "../../services/resident.service";
import {WorkerService} from "../../services/worker.service";
import {WorkorderService} from "../../services/workorder.service";
import {ElectronService} from "ngx-electron";
import {MatDialog} from "@angular/material";
import {SuccessComponent} from "../success/success.component";
import {WarningComponent} from "../warning/warning.component";
import index from "@angular/cli/lib/cli";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {

  export_button: HTMLInputElement;
  import_button: HTMLInputElement;
  remove_button: HTMLInputElement;
  archive_button: HTMLInputElement;
  progress_bar: HTMLInputElement;
  assets = [];
  buildings = [];
  departments = [];
  residents = [];
  workers = [];
  projectOrders = [];
  workOrders = [];
  fromDate;
  toDate;
  beforeDate = new Date();

  fs;
  appPath;
  dbPath;
  archivePath;

  //initialize all the existing table service.
  constructor(private assetService: AssetService,
              private buildingService: BuildingService,
              private departmentService: DepartmentService,
              private projectOrderService: ProjectorderService,
              private residentService: ResidentService,
              private workerService: WorkerService,
              private workOrderService: WorkorderService,
              private _electronService: ElectronService,
              private _ngZone: NgZone,
              private dialog: MatDialog) {
    this.fs = this._electronService.remote.require('fs');

    this.appPath = this._electronService.remote.app.getAppPath();
    this.dbPath = this.appPath + '/db/backup.json';
    this.archivePath = this.appPath + '/db/archive.json'
  }

  ngOnInit() {
    this.findDepartments();
  }

  findProjectOrders() {
    this.projectOrderService.findProjectOrders().then(
      (projectOrders) => {
        this.projectOrderService.projectOrders = projectOrders;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findWorkOrders() {
    this.workOrderService.findWorkOrders().then(
      (workOrders) => {
        this.workOrderService.workOrders = workOrders;
        this.findProjectOrders()
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findResidents() {
    this.residentService.findResidents().then(
      (residents) => {
        this.residentService.residents = residents;
        this.findAssets();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findAssets() {
    this.assetService.findAssets().then(
      (assets) => {
        this.assetService.assets = assets;
        this.findWorkers();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findWorkers() {
    this.workerService.findWorkers().then(
      (workers) => {
        this.workerService.workers = workers;
        this.findWorkOrders();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  findDepartments() {
    this.departmentService.findDepartments().then(
      (departments) => {
        this.departmentService.departments = departments;
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
        this.findResidents();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  // Imports Function

  importAssets(assets) {
    if (assets.length > 0) {
      for (let i = 0; i < assets.length; i++) {
        // first check the asset exist with the asset Id
        if (typeof this.assetService.getAsset(assets[i].Id) === "undefined") {
          delete assets[i]._id;
          this.assetService.insertAsset(assets[i]).then(
            //here check if the index is the last index or not
            () => {
              if (assets.length === i + 1) {
                this.importWorkOrders(this.workOrders)
              }
            }
          ).catch(
            (err) => {
              console.log(err)
            }
          );
        } else {
          if (assets.length === i + 1) {
            this.importWorkOrders(this.workOrders)
          }
        }
        //if asset Id don't exist import the asset.
      }
    } else {
      this.importWorkOrders(this.workOrders)
    }
  }

  //if workorder is inserted from archive. then we need to make the archive file empty
  //remove the archive insert from importWorkOrder.
  //rather we need to make another function for the archive import
  importWorkOrders(workOrders) {
    if (workOrders.length > 0) {
      for (let i = 0; i < workOrders.length; i++) {
        if (typeof this.workOrderService.getWorkOrder(workOrders[i].Id) === "undefined") {
          delete workOrders[i]._id;
          //convert the date issue string to date object
          if (workOrders[i].dateIssue != null || typeof workOrders[i].dateIssue != "undefined") {
            let dateStr = workOrders[i].dateIssue;
            workOrders[i].dateIssue = new Date(dateStr)
          }
          //convert the date completed string to date object
          if (workOrders[i].dateCompleted != null || typeof workOrders[i].dateCompleted != "undefined") {
            let dateStr = workOrders[i].dateCompleted;
            let dateCompleted = new Date(dateStr);
            if (dateCompleted.getFullYear() < 2000) {
              workOrders[i].dateCompleted = null;
              workOrders[i].status = 'Open';
            } else {
              workOrders[i].dateCompleted = dateCompleted;
            }
          }
          this.workOrderService.insertWorkOrder(workOrders[i]).then(
            //here check if the index is the last index or not
            () => {
              if (workOrders.length === i + 1) {
                this.importProjectOrders(this.projectOrders);
              }
            }
          ).catch(
            (err) => {
              alert(err)
            }
          );
        } else {
          if (workOrders.length === i + 1) {
            this.importProjectOrders(this.projectOrders);
          }
        }
      }
    } else {
      this.importProjectOrders(this.projectOrders);
    }
  }

  importProjectOrders(projectOrders) {
    if (projectOrders.length > 0) {
      for (let i = 0; i < projectOrders.length; i++) {
        if (typeof this.projectOrderService.getProjectOrder(projectOrders[i].Id) === "undefined") {
          delete projectOrders[i]._id;
          //convert the date issue string to date object
          if (projectOrders[i].dateIssue != null || typeof projectOrders[i].dateIssue != "undefined") {
            let dateStr = projectOrders[i].dateIssue;
            projectOrders[i].dateIssue = new Date(dateStr)
          }
          //convert the date completed string to date object
          if (projectOrders[i].dateCompleted != null || typeof projectOrders[i].dateCompleted != "undefined") {
            let dateStr = projectOrders[i].dateCompleted;
            let dateCompleted = new Date(dateStr);
            if (dateCompleted.getFullYear() < 2000) {
              projectOrders[i].dateCompleted = null;
              projectOrders[i].status = 'Open';
            } else {
              projectOrders[i].dateCompleted = dateCompleted;
            }
          }
          this.projectOrderService.insertProjectOrder(projectOrders[i]).then(
            //here check if the index is the last index or not
            () => {
              if (projectOrders.length === i + 1) {
                this.showSuccessDialog()
              }
            }
          ).catch(
            (err) => {
              alert(err)
            }
          );
        } else {
          this.showSuccessDialog()
        }
      }
    } else {
      this.showSuccessDialog()
    }
  }

  importResidents(residents) {
    if (residents.length > 0) {
      for (let i = 0; i < residents.length; i++) {
        if (typeof this.residentService.getResident(residents[i].Id) === "undefined") {
          delete residents[i]._id;
          this.residentService.insertResident(residents[i]).then(
            //here check if the index is the last index or not
            () => {
              if (residents.length === i + 1) {
                this.importAssets(this.assets)
              }
            }
          ).catch(
            (err) => {
              alert(err)
            }
          );
        } else {
          if (residents.length === i + 1) {
            this.importAssets(this.assets)
          }
        }
      }
    } else {
      this.importAssets(this.assets)
    }
  }

  importDepartments(departments) {
    if (departments.length > 0) {
      for (let i = 0; i < departments.length; i++) {
        if (typeof this.departmentService.getDepartment(departments[i].Id) === "undefined") {
          delete departments[i]._id;
          this.departmentService.insertDepartment(departments[i]).then(
            //here check if the index is the last index or not
            () => {
              if (departments.length === i + 1) {
                this.importWorkers(this.workers)
              }
            }
          ).catch(
            (err) => {
              alert(err)
            }
          );
        } else {
          if (departments.length === i + 1) {
            this.importWorkers(this.workers)
          }
        }
      }
    } else {
      this.importWorkers(this.workers)
    }
  }

  importWorkers(workers) {
    if (workers.length > 0) {
      for (let i = 0; i < workers.length; i++) {
        if (typeof this.workerService.getWorker(workers[i].Id) === "undefined") {
          delete workers[i]._id;
          this.workerService.insertWorker(workers[i]).then(
            //here check if the index is the last index or not
            () => {
              if (workers.length === i + 1) {
                this.importResidents(this.residents);
              }
            }
          ).catch(
            (err) => {
              console.log(err)
            }
          );
        } else {
          if (workers.length === i + 1) {
            this.importResidents(this.residents);
          }
        }
      }
    } else {
      this.importResidents(this.residents);
    }
  }

  importBuildings(buildings) {
    if (buildings.length > 0) {
      for (let i = 0; i < buildings.length; i++) {
        if (typeof this.buildingService.getBuilding(buildings[i].Id) === "undefined") {
          //before insert the object remove the key _id
          delete buildings[i]._id;
          this.buildingService.insertBuilding(buildings[i]).then(
            //here check if the index is the last index or not
            () => {
              if (buildings.length === i + 1) {
                this.importDepartments(this.departments)
              }
            }
          ).catch(
            (err) => {
              console.log(err)
            }
          );
        } else {
          if (buildings.length === i + 1) {
            this.importDepartments(this.departments)
          }
        }
      }
    } else {
      this.importDepartments(this.departments)
    }
  }

  //Remove Function

  removeProjectOrders() {
    let projectOrders = this.projectOrderService.getProjectOrders();
    if (projectOrders.length > 0) {
      for (let i = 0; i < projectOrders.length; i++) {
        this.projectOrderService.removeProjectOrder(projectOrders[i].Id).then(
          () => {
            if (projectOrders.length === i + 1) {
              this.export_button.disabled = false;
              this.import_button.disabled = false;
              this.remove_button.disabled = false;
              this.archive_button.disabled = false;

              this.progress_bar.setAttribute('style', 'display:none');

              //show the success message here.
              alert('Data successfully removed')
            }
          }
        ).catch(
          (err) => {
            alert(err)
          }
        );
      }
    } else {
      //show the success message
      this.export_button.disabled = false;
      this.import_button.disabled = false;
      this.remove_button.disabled = false;
      this.archive_button.disabled = false;

      this.progress_bar.setAttribute('style', 'display:none');

      //show the success message here.
      alert('Data successfully removed')
    }
  }

  removeWorkOrders() {
    let workOrders = this.workOrderService.getWorkOrders();
    if (workOrders.length > 0) {
      for (let i = 0; i < workOrders.length; i++) {
        this.workOrderService.removeWorkOrder(workOrders[i].Id).then(
          () => {
            if (workOrders.length === i + 1) {
              this.removeProjectOrders()
            }
          }
        ).catch(
          (err) => {
            alert(err)
          }
        );
      }
    } else {
      this.removeProjectOrders()
    }
  }

  removeAssets() {
    let assets = this.assetService.getAssets();
    if (assets.length > 0) {
      for (let i = 0; i < assets.length; i++) {
        this.assetService.removeAsset(assets[i].Id).then(
          () => {
            if (assets.length === i + 1) {
              this.removeWorkOrders()
            }
          }
        ).catch(
          (err) => {
            alert(err)
          }
        );
      }
    } else {
      this.removeWorkOrders()
    }
  }

  removeResidents() {
    let residents = this.residentService.getResidents();
    if (residents.length > 0) {
      for (let i = 0; i < residents.length; i++) {
        this.residentService.removeResident(residents[i].Id).then(
          () => {
            if (residents.length === i + 1) {
              this.removeAssets()
            }
          }
        ).catch(
          (err) => {
            alert(err)
          }
        );
      }
    } else {
      this.removeAssets()
    }
  }

  removeWorkers() {
    let workers = this.workerService.getWorkers();
    if (workers.length > 0) {
      for (let i = 0; i < workers.length; i++) {
        this.workerService.removeWorker(workers[i].Id).then(
          () => {
            if (workers.length === i + 1) {
              this.removeResidents()
            }
          }
        ).catch(
          (err) => {
            alert(err)
          }
        );
      }
    } else {
      this.removeResidents();
    }
  }

  removeDepartments() {
    let departments = this.departmentService.getDepartments();
    if (departments.length > 0) {
      for (let i = 0; i < departments.length; i++) {
        this.departmentService.removeDepartment(departments[i].Id).then(
          () => {
            if (departments.length === i + 1) {
              this.removeWorkers()
            }
          }
        ).catch(
          (err) => {
            alert(err)
          }
        );
      }
    } else {
      this.removeWorkers()
    }
  }

  removeBuildings() {
    let buildings = this.buildingService.getBuildings();
    if (buildings.length > 0) {
      for (let i = 0; i < buildings.length; i++) {
        this.buildingService.removeBuilding(buildings[i].Id).then(
          () => {
            if (buildings.length === i + 1) {
              this.removeDepartments()
            }
          }
        ).catch(
          (err) => {
            alert(err)
          }
        );
      }
    } else {
      this.removeDepartments()
    }
  }

  showSuccessDialog(message = "Data imported successfully") {
    alert(message);
    //hide progress bar
    this.progress_bar.setAttribute('style', 'display:none');

    //enable the Import and Export Button.
    this.export_button.disabled = false;
    this.import_button.disabled = false;
    this.remove_button.disabled = false;
    this.archive_button.disabled = false;
  }

  onExportData() {
    let data = {};
    data['projectOrders'] = this.projectOrderService.projectOrders;
    data['workOrders'] = this.workOrderService.workOrders;
    data['workers'] = this.workerService.workers;
    data['assets'] = this.assetService.assets;
    data['departments'] = this.departmentService.departments;
    data['residents'] = this.residentService.residents;
    data['buildings'] = this.buildingService.buildings;
    // this._electronService.ipcRenderer.send('export-data', data);
    //show progress bar
    this.progress_bar.setAttribute('style', 'display:block');
    //disable the Import and Export Button.

    this.export_button.disabled = true;
    this.import_button.disabled = true;
    this.remove_button.disabled = true;
    this.archive_button.disabled = true;

    //write the data to the text file
    let json = JSON.stringify(data);
    let self = this;

    //First check file exist or not. If file doesn't exists then create the file and then Write.
    this.fs.writeFile(this.dbPath, json, 'utf8', function (err) {
      if (err) {
        //alert the error
        alert(err);
      } else {
        //hide progress bar
        let message = "Data Exported Successfully";
        self.showSuccessDialog(message)
      }
    });
  }

  onImportData() {
    //this._electronService.ipcRenderer.send('import-data');
    //show progress bar
    this.progress_bar.setAttribute('style', 'display:block');

    //disable the Import and Export Button.
    this.export_button.disabled = true;
    this.import_button.disabled = true;
    this.remove_button.disabled = true;
    this.archive_button.disabled = true;
    let self = this;

    this.fs.readFile(this.dbPath, 'utf8', function readFileCallback(err, data) {
      if (err) {
        alert(err);
      } else {
        if (data != null && data != '') {
          let obj = JSON.parse(data);
          self.buildings = obj['buildings'];
          self.departments = obj['departments'];
          self.workers = obj['workers'];
          self.residents = obj['residents'];
          self.assets = obj['assets'];
          self.workOrders = obj['workOrders'];
          self.projectOrders = obj['projectOrders'];

          self.importBuildings(self.buildings);
        }
      }
    });
  }

  importFromArchiveProjectOrders(projectOrders, workOrdersToWrite) {
    let projectOrdersToWrite = projectOrders;
    if (projectOrders.length > 0) {
      projectOrders.map((projectOrder, i) => {
        if (typeof this.projectOrderService.getProjectOrder(projectOrder.Id) === "undefined") {
          delete projectOrder._id;
          let isInsideDateRange = false;
          if (!this.isNullOrEmpty(projectOrder.dateIssue)) {
            let dateStr = projectOrder.dateIssue;
            projectOrder.dateIssue = new Date(dateStr);
            // first check if the from date is less than date issue or not
            isInsideDateRange = !this.isNullOrEmpty(this.fromDate) ? projectOrder.dateIssue >= this.fromDate : isInsideDateRange;
          }
          //convert the date completed string to date object
          if (!this.isNullOrEmpty(projectOrder.dateCompleted)) {
            let dateStr = projectOrder.dateCompleted;
            let dateCompleted = new Date(dateStr);
            // then check if the date to is greater than date completed or not
            isInsideDateRange = !this.isNullOrEmpty(this.toDate) ? dateCompleted <= this.toDate : isInsideDateRange;
            if (dateCompleted.getFullYear() < 2000) {
              projectOrder.dateCompleted = null;
            } else {
              projectOrder.dateCompleted = dateCompleted;
            }
          }
          if (isInsideDateRange || (this.isNullOrEmpty(this.fromDate) && this.isNullOrEmpty(this.toDate))) {
            // if both true then insert the workOrder
            this.projectOrderService.insertProjectOrder(projectOrder).then(
              //here check if the index is the last index or not
              () => {
                projectOrdersToWrite = projectOrdersToWrite.filter(w => w.Id !== projectOrder.Id);
                if (projectOrders.length === i + 1) {
                  // rewrite the archive workOrders
                  // this.writeToArchive(workOrdersToWrite);
                  this.writeToArchive(projectOrdersToWrite, workOrdersToWrite)
                }
              }).catch(
              (err) => {
                alert(err)
              }
            );
          } else {
            if (projectOrders.length === i + 1) {
              // this.writeToArchive(workOrdersToWrite);
              this.writeToArchive(projectOrdersToWrite, workOrdersToWrite)
            }
          }

        } else {
          if (projectOrders.length === i + 1) {
            // this.writeToArchive(workOrdersToWrite);
            this.writeToArchive(projectOrdersToWrite, workOrdersToWrite)
          }
        }
      })
    } else {
      this.writeToArchive(projectOrdersToWrite, workOrdersToWrite)
    }
  }

  importFromArchiveWorkOrders(workOrders, projectOrders) {
    // first check if the workorder is null of undefined
    // if not then loop through the workOrders
    // check if the workorder is inside the archive date range
    // if inside the date range import that workOrders and remove that workorder from the workOrderToWrite Array
    // finally check if all the workOrder is inserted or not.
    // if all the workOrder inserted then call the writeToArchive function and pass workOrdersToWrite
    let workOrdersToWrite = workOrders;
    // assign workOrder to another variable. we can say workOrdersToWrite
    if (workOrders.length > 0) {
      workOrders.map((workOrder, i) => {
        if (typeof this.workOrderService.getWorkOrder(workOrder.Id) === "undefined") {
          delete workOrder._id;
          let isInsideDateRange = false;
          //convert the date issue string to date object
          if (!this.isNullOrEmpty(workOrder.dateIssue)) {
            let dateStr = workOrder.dateIssue;
            workOrder.dateIssue = new Date(dateStr);
            // first check if the from date is less than date issue or not
            isInsideDateRange = !this.isNullOrEmpty(this.fromDate) ? workOrder.dateIssue >= this.fromDate : isInsideDateRange;
          }
          //convert the date completed string to date object
          if (!this.isNullOrEmpty(workOrder.dateCompleted)) {
            let dateStr = workOrder.dateCompleted;
            let dateCompleted = new Date(dateStr);
            // then check if the date to is greater than date completed or not
            isInsideDateRange = !this.isNullOrEmpty(this.toDate) ? dateCompleted <= this.toDate : isInsideDateRange;
            if (dateCompleted.getFullYear() < 2000) {
              workOrder.dateCompleted = null;
              workOrder.status = 'Open';
            } else {
              workOrder.dateCompleted = dateCompleted;
            }
          }
          if (isInsideDateRange || (this.isNullOrEmpty(this.fromDate) && this.isNullOrEmpty(this.toDate))) {
            // if both true then insert the workOrder
            this.workOrderService.insertWorkOrder(workOrder).then(
              //here check if the index is the last index or not
              () => {
                workOrdersToWrite = workOrdersToWrite.filter(w => w.Id !== workOrder.Id);
                if (workOrders.length === i + 1) {
                  // rewrite the archive workOrders
                  // this.writeToArchive(workOrdersToWrite);
                  this.importFromArchiveProjectOrders(projectOrders, workOrdersToWrite)
                }
              }).catch(
              (err) => {
                alert(err)
              }
            );
          } else {
            if (workOrders.length === i + 1) {
              // this.writeToArchive(workOrdersToWrite);
              this.importFromArchiveProjectOrders(projectOrders, workOrdersToWrite)
            }
          }
        } else {
          if (workOrders.length === i + 1) {
            // this.writeToArchive(workOrdersToWrite);
            this.importFromArchiveProjectOrders(projectOrders, workOrdersToWrite)
          }
        }
      })
    } else {
      this.importFromArchiveProjectOrders(projectOrders, workOrdersToWrite)
    }
  }

  isNullOrEmpty(obj) {
    return typeof obj === "undefined" || obj === null;

  }

  onImportFromArchive() {

    let self = this;
    //show progress bar
    this.progress_bar.setAttribute('style', 'display:block');
    //disable the Import and Export Button.

    this.export_button.disabled = true;
    this.import_button.disabled = true;
    this.remove_button.disabled = true;
    this.archive_button.disabled = true;

    this.fs.readFile(this.archivePath, 'utf8', function readFileCallback(err, data) {
      if (err) {
        alert(err);
      } else {
        if (!self.isNullOrEmpty(data)) {
          let obj = JSON.parse(data);
          let workOrders = obj['workOrders'];
          let projectOrders = obj['projectOrders'];
          if (self.isNullOrEmpty(workOrders)) workOrders = [];
          if (self.isNullOrEmpty(projectOrders)) projectOrders = [];
          //Now write the orders into the file
          self.importFromArchiveWorkOrders(workOrders, projectOrders)
        } else {
          self.showSuccessDialog()
        }
      }
    });
  }

  writeToArchiveByDateRange() {
    let workOrdersToDelete = [];
    let projectOrdersToDelete = [];
    let self = this;
    //show progress bar
    this.progress_bar.setAttribute('style', 'display:block');
    //disable the Import and Export Button.

    this.export_button.disabled = true;
    this.import_button.disabled = true;
    this.remove_button.disabled = true;
    this.archive_button.disabled = true;
    // first check if the workOrder or projectOrder date is before the text-box date
    // first find out the workOrder and ProjectOrder by before Date
    // then write that workOrder and ProjectOrder to the archive file
    // after write to the file delete all the workOrder and ProjectOrder from the main database

    // ***************** Important Notes ***************
    // since there might have previously written workOrders or projectOrders
    // first we need to read from that file and need to Assign in the worOrdersToDelete and projectOrdersToDelete array
    if (!this.isNullOrEmpty(this.beforeDate)) {
      this.fs.readFile(this.archivePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
          alert(err);
        } else {
          if (!self.isNullOrEmpty(data)) {
            let obj = JSON.parse(data);
            let workOrders = obj['workOrders'];
            let projectOrders = obj['projectOrders'];

            self.workOrders.map((workOrder) => {
              if (workOrder.dateCompleted <= self.beforeDate) {
                workOrder.delete = true;
                workOrdersToDelete.push(workOrder);
              }
            });
            self.projectOrders.map((projectOrder) => {
              if (projectOrder.dateCompleted <= self.beforeDate) {
                projectOrder.delete = true;
                projectOrdersToDelete.push(projectOrder);
              }
            });
            if (!self.isNullOrEmpty(workOrders)) {
              workOrders.map((workOrder) => {
                workOrder.delete = false;
                workOrdersToDelete.push(workOrder);
              })
            }
            if (!self.isNullOrEmpty(projectOrders)) {
              projectOrders.map((projectOrder) => {
                projectOrder.delete = false;
                projectOrdersToDelete.push(projectOrder);
              })
            }
          }
          // first write the workOrdersToDelete and projectOrdersToDelete in the file
          /// after writing is done delete that orders from the main database
          self.deleteWorkOrderFromDatabase(workOrdersToDelete, projectOrdersToDelete);
        }
      });
    } else {
      alert('Please select the before date for write to archive');
    }
  }

  deleteWorkOrderFromDatabase(workOrdersToDelete, projectOrdersToDelete) {
    if (workOrdersToDelete.length > 0) {
      workOrdersToDelete.map((workOrder, index) => {
        if (workOrder.delete) {
          this.workOrderService.removeWorkOrder(workOrder.Id).then(
            () => {
              delete workOrder.delete;
              if (workOrdersToDelete.length === index + 1) {
                // delete ProjectOrder
                this.deleteProjectOrderFromDatabase(projectOrdersToDelete, workOrdersToDelete);
              }
            },
            (err) => {
              alert(err)
            });
        } else {
          delete workOrder.delete;
          if (workOrdersToDelete.length === index + 1) {
            this.deleteProjectOrderFromDatabase(projectOrdersToDelete, workOrdersToDelete);
          }
        }
      })
    } else {
      this.deleteProjectOrderFromDatabase(projectOrdersToDelete, workOrdersToDelete);
    }
  }

  deleteProjectOrderFromDatabase(projectOrdersToDelete, workOrdersToDelete) {
    if (projectOrdersToDelete.length > 0) {
      projectOrdersToDelete.map((projectOrder, index) => {
        if (projectOrdersToDelete.delete) {
          this.projectOrderService.removeProjectOrder(projectOrder.Id).then(
            () => {
              delete projectOrdersToDelete.delete;
              if (projectOrdersToDelete.length === index + 1) {
                // delete ProjectOrder
                this.writeToArchive(workOrdersToDelete, projectOrdersToDelete);
              }
            },
            (err) => {
              alert(err)
            });
        } else {
          delete projectOrdersToDelete.delete;
          if (projectOrdersToDelete.length === index + 1) {
            this.writeToArchive(workOrdersToDelete, projectOrdersToDelete);
          }
        }
      })
    } else {
      this.writeToArchive(workOrdersToDelete, projectOrdersToDelete);
    }
  }

  writeToArchive(workOrders, projectOrders) {
    let data = {};
    data['workOrders'] = workOrders;
    data['projectOrders'] = projectOrders;
    let self = this;
    let json = JSON.stringify(data);
    this.fs.writeFile(this.archivePath, json, 'utf8', function (err) {
      if (err) {
        //alert the error
        alert(err);
      } else {
        let message = "Data successfully imported from archive";
        self.showSuccessDialog(message);
      }
    });
  }

  onRemoveData() {
    const dialogRef = this.dialog.open(WarningComponent, {
      data: {
        name: 'this is default text'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //show progress bar
        this.progress_bar.setAttribute('style', 'display:block');
        //disable the Import and Export Button.

        this.export_button.disabled = true;
        this.import_button.disabled = true;
        this.remove_button.disabled = true;
        this.archive_button.disabled = true;

        //remove everything
        this.removeBuildings();
      }
    });
  }

  ngAfterViewInit(): void {
    this.progress_bar = <HTMLInputElement>document.getElementById('import-export-progress');
    this.export_button = <HTMLInputElement>document.getElementById('export-button');
    this.import_button = <HTMLInputElement>document.getElementById('import-button');
    this.archive_button = <HTMLInputElement>document.getElementById('archive-button');
    this.remove_button = <HTMLInputElement>document.getElementById('remove-button');

    this.progress_bar.setAttribute('style', 'display:none');
  }

}
