import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Barcode } from '../../vos/barcode';

@Injectable({
  providedIn: 'root'
})
export class BarcodeChangeService {

  // private barcodeSource = new BehaviorSubject(new Barcode());
  private barcodeSource = new Subject();
  currentBarcode = this.barcodeSource.asObservable();

  constructor() { }

  changeBarcode(barcode: Barcode) {
    this.barcodeSource.next(barcode);
  }

}
