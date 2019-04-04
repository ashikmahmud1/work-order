import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WorkorderService} from "../../../services/workorder.service";
import * as html2canvas from "html2canvas";
import {Router} from "@angular/router";

declare var jsPDF: any;

@Component({
  selector: 'app-full-work-order-print',
  templateUrl: './full-work-order-print.component.html',
  styleUrls: ['./full-work-order-print.component.css']
})
export class FullWorkOrderPrintComponent implements OnInit, AfterViewInit {

  pageArray = [];

  constructor(private workOrderService: WorkorderService,
              private router:Router) {
  }

  ngOnInit() {
    this.pageArray = this.workOrderService.printWorkOrders;
    console.log(this.pageArray);
  }

  print() {
    html2canvas(document.getElementById('print-section')).then(function (canvas) {

      let imgData = canvas.toDataURL('image/png');

      /*
      Here are the numbers (paper width and height) that I found to work.
      It still creates a little overlap part between the pages, but good enough for me.
      if you can find an official number from jsPDF, use them.
      */
      let imgWidth = 210;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let doc = new jsPDF('p', 'mm');
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save('file.pdf');﻿
    });
    this.router.navigateByUrl('full-work-order');
  }

  ngAfterViewInit() {
    this.print();
  }

}
