import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Barcode } from '../../vos/barcode';

@Injectable()
export class BarcodeListService {

    public barcodes: Barcode[] = [];
    constructor() { }

    getAllBarcodes(): Barcode[] {

        // localStorage.setItem('localData', JSON.stringify([]));

        if (localStorage.getItem('localData') !== null) {
            this.barcodes = JSON.parse(localStorage.getItem('localData'));
            console.log('Second');
        } else {
            const barcodeArrayData = [
                {
                    id: 1,
                    barcode: '122222333334',
                    qty: 2,
                },
                {
                    id: 2,
                    barcode: '566666777778',
                    qty: 1,
                }
            ];
            localStorage.setItem('localData', JSON.stringify(barcodeArrayData));
            this.barcodes = JSON.parse(localStorage.getItem('localData'));
            console.log('First');
        }
        return this.barcodes;
    }

    getBarcodeById(id: number): Barcode {
        const barcodeArray = JSON.parse(localStorage.getItem('localData'));
        console.log(barcodeArray);
        return barcodeArray
          .filter(barcode => barcode.id === id)
          .pop();
    }

    updateBarcodeById(barcode): Barcode {
        if (barcode.id === 0) {
            const barcodeArray = JSON.parse(localStorage.getItem('localData'));
            let barcodeid = 0;
            for (let i in barcodeArray) {
                if (barcodeArray[i].id > barcodeid) {
                    barcodeid = barcodeArray[i].id;
                }
            }
            barcode.id = ++barcodeid;
            barcodeArray.push(barcode);

            localStorage.setItem('localData', JSON.stringify(barcodeArray));
        } else {
            const barcodeSaveArray = JSON.parse(localStorage.getItem('localData'));
            for (let i in barcodeSaveArray) {
                if (barcodeSaveArray[i].id === barcode.id) {
                    barcodeSaveArray[i] = barcode;
                    localStorage.setItem('localData', JSON.stringify(barcodeSaveArray));
                }
            }
        }
        return barcode;
    }

    deleteBarcodeDetail(id) {
        const barcodeArray = JSON.parse(localStorage.getItem('localData'));
        for (let i in barcodeArray) {
            if (barcodeArray[i].id === id) {
                barcodeArray.splice(i, 1);
                localStorage.setItem('localData', JSON.stringify(barcodeArray));
            }
        }
    }
}
