import { DatePipe } from "@angular/common";
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { StorageService } from "src/app/storage.service";
import * as moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';
import { ReportsApi } from '../reports/reports.api';
import { ReportsService } from "../reports/reports.service";

@Component({
  selector: 'app-pos2',
  templateUrl: './pos2.component.html',
  styleUrls: ['./pos2.component.scss']
})
export class Pos2Component implements OnInit {

  pos2Form: FormGroup;
  today = new Date();
  minimumDate = new Date();
  minimumDate1 = new Date();
  somedate = new Date();
  somedate1 = new Date();
  advancesearchdata: any;
  advancesearchflag: any;
  @Input() fetchingReport: boolean;
  @Output() pos2Data = new EventEmitter();
  unsubscribeSubs = new Subject();
  newdate: any;
  constructor(private datePipe: DatePipe, private storageService: StorageService, private cdref: ChangeDetectorRef,private reportService: ReportsService,) { }

  ngOnInit() {
    this.pos2Form = new FormGroup({
      pos2Report: new FormControl('POS REPORT', null),
      subCat2: new FormControl('POS', null),
      dateRange: new FormControl(this.today, Validators.required),
      dateRange1: new FormControl(this.today, Validators.required),
    });
    this.minimumDate.setMonth(this.today.getMonth() - 2);

    this.subscribeDateRange();
    this.subscribeDateRange1();
  }


  subscribeDateRange() {
    this.pos2Form.get('dateRange').valueChanges
      .pipe(takeUntil(this.unsubscribeSubs))
      .subscribe(
        val => {
          const start = val;
          const startDate = new Date(start);
          this.newdate = val;
        }
      );
  }

  saverange(res) { // Double datepicker added by Akash
    this.minimumDate1 = res;
    var nextWeek = moment(new Date(this.minimumDate1)).add(9, 'days');
    let addedDate = nextWeek.format('YYYY-MM-DD')
    if ((moment().isAfter(nextWeek))) {
      this.somedate.setDate(new Date(addedDate).getDate());
      this.somedate1 = new Date(addedDate);
      this.pos2Form.get('dateRange1').setValue(this.somedate1);

    }
    else {
      this.somedate1 = this.today;
      this.pos2Form.get('dateRange1').setValue(this.today);
    }

  }
  subscribeDateRange1() {// Double datepicker added by Akash
    this.pos2Form.get('dateRange1').valueChanges
      .pipe(takeUntil(this.unsubscribeSubs))
      .subscribe(
        val => {
          const end = val;
          const endDate = new Date(end);
        }
      );
  }
  submitPos() {

    let reportData = {};

    const { dateRange, dateRange1 } = this.pos2Form.value;

    reportData = {
      "$1": "all_transaction_report",
      "$2": "demoisu",
      "$3": "All",
      "$4": this.datePipe.transform(dateRange, 'yyyy-MM-dd'),
      "$5": this.datePipe.transform(dateRange1, 'yyyy-MM-dd'),
      "$6": [
        "POS",
      ],
      "$7": [
        "Sale@POS"
      ]
    };
    this.pos2Data.emit({ type: 'pos2', data: reportData });

  }


  // this.dmt2Data.emit({ type: 'dmt2', data: { reportData, type, reporttype, reportDataG, reportDataGA, advsearch } });

  // this.dmt2Data.emit({type: 'dmt2', data: {reportData, retry: subCat === "RETRY" ? true : false, refund: subCat === "REFUNDPENDING" ? true : false }});


  ngOnDestroy() {
    this.unsubscribeSubs.next(true);
    this.unsubscribeSubs.complete();
  }
}
